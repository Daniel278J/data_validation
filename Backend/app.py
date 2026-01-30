from flask import Flask, request, jsonify
from flask_cors import CORS
import Main
import time
app = Flask(__name__)
CORS(app)  # enable CORS for frontend access


@app.route('/validate',methods=['POST'])
def routing():
    data = request.get_json()
    # print(data)
    src_connection_details = {'Host':data['host_src'],'Port':data['port_src'] ,'Database':data['db_src'] ,'Username':data['user_src'] , 'Password':data['password_src'] }
    des_connection_details =  {'Host':data['host_des'],'Port':data['port_des'] ,'Database':data['db_des'] ,'Username':data['user_des'] , 'Password':data['password_des'] }
    print(src_connection_details,"\n",des_connection_details)

    src=data['src']
    des=data['des']

    start_time = time.time()

    actual_data,output_data=Main.main(src,des,src_connection_details,des_connection_details)
    print(actual_data)
    print("********************************************************")
    print(output_data)

    end_time=time.time()
    print(end_time-start_time)
        
    return jsonify([actual_data,output_data])

@app.route('/',methods=['get'])
def home():
    return ("Hello world")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
