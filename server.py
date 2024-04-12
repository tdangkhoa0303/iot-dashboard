print("Sensors and Actuators")


import time
import sys
import random
import serial.tools.list_ports

from Adafruit_IO import MQTTClient

AIO_FEED_ID = ["button1", "button2", "button3"]
AIO_USERNAME = ""
AIO_KEY = ""


def connected(client):
    print("Connected succesfully!!")
    for id in AIO_FEED_ID:
        client.subscribe(id)


def subscribe(client, userdata, mid, granted_qos):
    print("Subscribed to Topic!!!")


def disconnected(client):
    print("Disconnected from Adafruit!!!")
    sys.exit(1)


def message(client, feed_id, payload):
    print("Received data: " + feed_id + " - " payload)
    if feed_id == "button1":
        if payload == "1":
            print("Relay1: ON")
            setDevice(True, 1)
        else:
            print("Relay1: OFF")
            setDevice(False, 1)
    elif feed_id == "button2":
        if payload == "1":
            print("Relay1: ON")
            setDevice(True, 2)
        else:
            print("Relay1: OFF")
            setDevice(False, 2)
    elif feed_id == "button3":
        if payload == "1":
            print("Relay1: ON")
            setDevice(True, 3)
        else:
            print("Relay1: OFF")
            setDevice(False, 3)


def get_port():
    ports = serial.tools.list_ports.comports()
    N = len(ports)
    commPort = "None"
    for i in range(0, N):
        port = ports[i]
        strPort = str(port)
        if "USB" in strPort:
            splitPort = strPort.split(" ")
            commPort = (splitPort[0])
    return commPort
    # return "/dev/ttyUSB1"


portName = "/dev/ttyUSB1"
print(portName)

try:
    ser = serial.Serial(port=portName, baudrate=9600)
    print("Open successfully")
except:
    print("Can not open the port")

relay1_ON = [0, 6, 0, 0, 0, 255, 200, 91]
relay1_OFF = [0, 6, 0, 0, 0, 0, 136, 27]
relay2_ON = [2, 6, 0, 0, 0, 255, 201, 185]
relay2_OFF = [2, 6, 0, 0, 0, 0, 137, 249]
relay3_ON = [3, 6, 0, 0, 0, 255, 200, 104]
relay3_OFF = [3, 6, 0, 0, 0, 0, 136, 40]
relay4_ON = [4, 6, 0, 0, 0, 255, 201, 223]
relay4_OFF = [4, 6, 0, 0, 0, 0, 137, 159]


def serial_read_data(ser):
    bytesToRead = ser.inWaiting()
    if bytesToRead > 0:
        out = ser.read(bytesToRead)
        data_array = [b for b in out]
        print(data_array)
        if len(data_array) >= 7:
            array_size = len(data_array)
            value = data_array[array_size - 4] * 256 + data_array[array_size - 3]
            return value
        else:
            return -1
    return 0


def set_device(state, num):
    if num == 1:
        relay_ON = relay1_ON
        relay_OFF = relay1_OFF
    elif num == 2:
        relay_ON = relay2_ON
        relay_OFF = relay2_OFF
    if num == 3:
        relay_ON = relay3_ON
        relay_OFF = relay3_OFF
    if num == 4:
        relay_ON = relay4_ON
        relay_OFF = relay4_OFF

    if state:
        ser.write(relay_ON)
    else:
        ser.write(relay_OFF)
    time.sleep(1)
    print(serial_read_data(ser))


'''
while True:
    setDevice1(True)
    time.sleep(2)
    setDevice1(False)
    time.sleep(2)
'''
soil_temperature = [1, 3, 0, 6, 0, 1, 100, 11]


def read_temperature():
    serial_read_data(ser)
    ser.write(soil_temperature)
    time.sleep(1)
    return serial_read_data(ser)


soil_moisture = [1, 3, 0, 7, 0, 1, 53, 203]


def read_moisture():
    serial_read_data(ser)
    ser.write(soil_moisture)
    time.sleep(1)
    return serial_read_data(ser)


client = MQTTClient(AIO_USERNAME, AIO_KEY)
client.on_connect = connected
client.on_disconnect = disconnected
client.on_message = message
client.on_subscribe = subscribe
client.connect()
client.loop_background()

signal_counter = 5
while True:
#    set_device(True, 4)
#    time.sleep(2)
#    set_device(False, 4)
#    time.sleep(2)
    moisture_data = read_moisture()
    flo_moisture = float(str(moisture_data)) / 100
    str_moisture = str(flo_moisture)
    print("Reading Moisture: " + str_moisture)
    
    temp_data = read_temperature()
    flo_temp = float(str(temp_data)) / 100
    str_temp = str(flo_temp)
    print("Reading Temperature: " + str_temp)
    time.sleep(1)
    
    signal_counter -= 1
    if signal_counter <= 0:
        signal_counter = 5
        print("Update Temperature feed: ", str_temp)
        client.publish("temperature", str_temp)
        print("Update Moisture feed: ", str_moisture)
        client.publish("moisture", str_moisture)