from sqlalchemy import inspect
from Connections.MySQL import MySQLEngine
from Connections.SybaseDB import SybaseEngine
from Connections.Oracle import OracleEngine
from Validation import validate_columns
from Validation import validate_tables
import pandas as pd
import csv
import traceback

Sybase = SybaseEngine
MySQL = MySQLEngine
Oracle = OracleEngine

def main(src_db, target_db, src_conn_details, dest_conn_details):

    source_class = globals()[src_db]
    target_class = globals()[target_db]

    try:
        with source_class(src_conn_details) as source, target_class(dest_conn_details) as target:

            data = []
            dummy_output = [["Table", "Schema Valid", "Missing Columns", "Excess Columns", "Datatypes Mismatched", "Primary Key Validity", "Data Matched", "Missing Primary Keys", "Excess Primary Keys", "Data Mismatched"]]
            # inspect the source and target databases
            src_inspect = inspect(source)
            target_inspect = inspect(target)

            # Get all the tables from the database
            all_tables = src_inspect.get_table_names()

            # For each table comparision
            for i in all_tables:
                output = [i]
                # Get source and destination tables description
                src_table_desc = (pd.DataFrame(src_inspect.get_columns(i))).iloc[:, :2]
                dest_table_desc = (pd.DataFrame(target_inspect.get_columns(i))).iloc[:, :2]

                # Validating the columns
                missing_columns, excess_columns, datatypes_mismatch = validate_columns(src_table_desc, dest_table_desc)
                
                # print(missing_columns, excess_columns, datatypes_mismatch)

                # Check for primary key verification
                primary_keys_source = src_inspect.get_pk_constraint(i)
                primary_keys_source = [x.lower() for x in primary_keys_source['constrained_columns']]
                primary_keys_target = target_inspect.get_pk_constraint(i)
                primary_keys_target = [x.lower() for x in primary_keys_target['constrained_columns']]
                if sorted(primary_keys_source) == sorted(primary_keys_target):
                    if len(primary_keys_source) == 0:
                        primary_key_valid = 'No Primary Key'   
                    else:
                        primary_key_valid = 'Yes'
                else:
                    primary_key_valid = [primary_keys_source, primary_keys_target]

                # Check the table data only if columns are matched
                if (missing_columns == 'No') and (excess_columns == 'No') and (datatypes_mismatch == 'No') and (type(primary_key_valid) == str ):
                    
                    output.append("Yes")
                    # Getting the actual table data
                    src_table = pd.read_sql(f"SELECT * FROM {i}", source)
                    dest_table = pd.read_sql(f"SELECT * FROM {i}", target)

                    # Validating the data
                    data_validation = validate_tables(src_table, dest_table, primary_keys_source)
                
                else:
                    data_validation = ['NA', 'NA', 'NA']
                    output.append("No")

                output.extend([missing_columns, excess_columns, datatypes_mismatch, primary_key_valid])

                if type(data_validation) == str:
                    output.append([f"{data_validation}"])
                    data_validation = ["N/A","N/A","N/A"]
                elif data_validation.count('No') != len(data_validation):
                    output.append("No")
                else:
                    output.append('Yes')
                output.extend(data_validation)
                data.append(output)
                
                list1=[]
                for i in output :
                    if type(i) !=  str and (output.index(i) == 5 or output.index(i) == 6):
                        list1.append("No")
                    elif type(i) !=  str:
                        list1.append('Yes')

                    else:
                        list1.append(i)
                dummy_output.append(list1)      
            
            return data,dummy_output
    except Exception as e:
        traceback.print_exc()
        return str(e),0
