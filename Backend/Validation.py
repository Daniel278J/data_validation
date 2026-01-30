import re
import numpy as np
from sqlalchemy import DOUBLE_PRECISION

# Function to compare any data using numpy
TYPE_MAP = {
    # Integers
    "INT": "INTEGER",
    "INTEGER": "INTEGER",
    "SMALLINT": "INTEGER",
    "BIGINT": "INTEGER",
    "TINYINT": "INTEGER",
    "SERIAL": "INTEGER",
    "BIGSERIAL": "INTEGER",
    "NUMBER": "INTEGER",

    # Floats
    "FLOAT": "FLOAT",
    "FLOAT4": "FLOAT",
    "FLOAT8": "FLOAT",
    "REAL": "FLOAT",
    "DOUBLE": "FLOAT",
    "DOUBLE PRECISION": "FLOAT",
    "DECIMAL": "NUMERIC",
    "NUMERIC": "NUMERIC",

    # Strings
    "CHAR": "STRING",
    "NCHAR": "STRING",
    "VARCHAR": "STRING",
    "CHARACTER VARYING": "STRING",
    "NVARCHAR": "STRING",
    "TEXT": "STRING",
    "CLOB": "STRING",

    # Boolean
    "BOOLEAN": "BOOLEAN",
    "BOOL": "BOOLEAN",

    # Date & Time
    "DATE": "DATE",
    "DATETIME": "DATETIME",
    "TIMESTAMP": "DATETIME",
    "TIME": "TIME",

    # Binary
    "BYTEA": "BINARY",
    "BLOB": "BINARY",
    "VARBINARY": "BINARY",
    "BINARY": "BINARY",

    # Fallback
    "JSON": "OTHER",
    "UUID": "OTHER",
    "XML": "OTHER"
}

def normalize(sql_type: str) -> str:
    sql_type = str(sql_type)
    if not isinstance(sql_type, str):
        return "OTHER"

    sql_type = sql_type.strip().upper()

    # Extract base type and precision (if any)
    match = re.match(r"([A-Z ]+)(\([0-9, ]+\))?", sql_type)
    if not match:
        return "OTHER"

    base_type = match.group(1).strip()
    precision = match.group(2) or ""

    # Map base type to canonical
    norm_base = TYPE_MAP.get(base_type, "OTHER")

    # Keep precision only if meaningful
    if precision and norm_base in ["STRING", "NUMERIC", "FLOAT"]:
        return f"{norm_base}{precision}"
    
    return norm_base
    

def validate_columns(src, dest):

    src = src.map(lambda x: x.lower() if isinstance(x, str) else x)
    dest = dest.map(lambda x: x.lower() if isinstance(x, str) else x)

    # Outer join to get the nan values
    join = src.merge(dest, on = 'name', how = 'outer').set_index('name')

    # To get the columns that is there in source but not in destination
    dest_nan = join["type_y"].isna()
    missing_col = list(dest_nan.loc[dest_nan].index)

    # To get the columns that is there in destination but not in source
    src_nan = join["type_x"].isna()
    excess_col = list(src_nan.loc[src_nan].index)

    # Checking the datatypes
    join = join.dropna()

    # src_type = list(map(str,join['type_x']))                      -------->Modified<-----
    # src_type = join['type_x'].astype(str).to_numpy()

    # dest_type = list(map(str,join['type_y']))                     -------->Modified<-----
    # dest_type = join['type_y'].astype(str).to_numpy()                

    # datatypes_mismatch = find_all_mismatches_np(src_type, dest_type)


    join["type_x"] = join["type_x"].apply(normalize)
    join["type_y"] = join["type_y"].apply(normalize)
    datatypes_mismatch = join.index[join['type_x'].astype(str) != join['type_y'].astype(str)]
    print(join)
    print(datatypes_mismatch)

    # for i in range(len(datatypes_mismatch)):
    #     datatypes_mismatch[i] = join.index[datatypes_mismatch[i]]      -------->Modified<-----
    # datatypes_mismatch = [join.index[i] for i in datatypes_mismatch]

    # d ={}
    # for i in datatypes_mismatch:
    #     d[i] = [repr(join['type_x'][i]), repr(join['type_y'][i])]         -------->Modified<-----

    d = {i: [repr(join['type_x'][i]), repr(join['type_y'][i])] for i in datatypes_mismatch}
    print(d)
    # To write into csv make the edits
    if len(missing_col) == 0:
        missing_col = "No"
    if len(excess_col) == 0:
        excess_col = "No"
    if len(datatypes_mismatch) == 0:
        d = "No"

    return missing_col, excess_col, d


def validate_tables(src,dest,k):

    # Getting all the columns and removing the columns used for joining
    # columns = src.columns.tolist()
    # columns = np.setdiff1d(np.array(columns), np.array(k))                -------->Modified<-----
    src.columns = src.columns.str.lower()
    dest.columns = dest.columns.str.lower()
    
    columns = np.setdiff1d(src.columns.values, k)
    print("============================================",k)
    if len(k) == 0:
        src = (src.sort_values(by=list(src.columns))).sort_index(axis=1)
        dest = dest.sort_values(by=list(dest.columns)).sort_index(axis=1)
        if src.shape[0] != dest.shape[0]:
            return "No of rows are not same in source and destination"
        elif not src.equals(dest):
            return "Data is not valid"
        else:
            return "No","No","No"
    
    # Outer join on primary key to get the nan values
    outer_join_df = src.merge(dest, on=k, how='outer').set_index(k)         

    # To get the data that is there in destination but not in source
    # src_nan = outer_join_df[columns[-1]+'_x'].isna()                          -------->Modified<-----

    # excess_data =list(src_nan.loc[src_nan].index) 

    excess_data = outer_join_df.index[outer_join_df[columns[-1]+'_x'].isna()].to_list()
    
    # To get the data that is there in source but not in destination                -------->Modified<-----
    # dest_nan = outer_join_df[columns[-1]+'_y'].isna() 
    # missing_data =list(dest_nan.loc[dest_nan].index) 

    missing_data = outer_join_df.index[outer_join_df[columns[-1]+'_y'].isna()].to_list()
    # Inner join to get the data whose primary key is matched
    inner_join_df = src.merge(dest, on=k, how='inner')



    mismatch_dict ={}
    for i in columns:
        i=str(i)
        # mismatch_indices = find_all_mismatches_np(inner_join_df[i+'_x'], inner_join_df[i + '_y'])         ------->Modified<-----

        mismatch_indices = inner_join_df.index[inner_join_df[i+'_x'].astype(str) != inner_join_df[i+'_y'].astype(str)]
        
        if len(mismatch_indices) != 0:
            # mismatch_dict[i] = []
            
            # for j in mismatch_indices:
            #     mismatch_dict[i].extend(inner_join_df[k].values.tolist()[j])                ------->Modified<-----

            # Precompute the full list of rows once
            k_values = inner_join_df[k].values.tolist()

            # Assign only the mismatched rows
            mismatch_dict[i] = [k_values[j] for j in mismatch_indices]

                
    # To write into csv make the edits
    if len(missing_data) == 0:
        missing_data = 'No' 
    if len(excess_data) == 0:
        excess_data = "No"
    if len(mismatch_dict) == 0:
        mismatch_dict = "No"

    return missing_data, excess_data, mismatch_dict

