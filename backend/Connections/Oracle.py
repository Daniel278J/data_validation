from sqlalchemy import create_engine, inspect

class OracleEngine:
    def __init__(self, conn_details):
        self.conn_details = conn_details
        print(f"oracle+oracledb://{self.conn_details['Username']}:{self.conn_details['Password']}@{self.conn_details['Host']}:{self.conn_details['Port']}/?service_name={self.conn_details['Database']}")

    def __enter__(self):
        self.engine = create_engine(f"oracle+oracledb://{self.conn_details['Username']}:{self.conn_details['Password']}@{self.conn_details['Host']}:{self.conn_details['Port']}/?service_name={self.conn_details['Database']}",
        pool_size=5,
        max_overflow=2,
        pool_timeout=30,
                                                    #---------------------->Modified<-----------------------
        pool_recycle=1800,
        pool_pre_ping=True)
        self.connection = self.engine.connect()
         
    
        return  self.connection

    def __exit__(self, exc_type, exc_value, traceback):

        if exc_type:
            print(f"An error occurred: {exc_value}")

        if self.engine:
            self.connection.close()
            print("Oracle Closed")
