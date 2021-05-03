
/*
 * PanicAlarm Watch
 * IOT Project
 * Group 2 - 6CSE10
 * Presidency University, Bangalore
*/


#include <Arduino.h>
#include <EEPROM.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <WiFiManager.h>
#include <Scheduler.h>


#define __HALT__ while(1)

#define __DEBUG__ 1
void __log__(String msg);


void sendDataToHost(int pulse);

// Global Constants 
const int MANUAL_TRIG_BUTTON = 4;
const int INDICATOR_LED =  5;
const int EEPROM_SIZE = 512;
const int ALERT_ID_LENGTH = 24;
const int HTTP_PORT = 443;
const char *WATCH_HOTSPOT_NAME = "PanicAlarm Watch - 6CSE10";
String API_HOST = "panicalarm.vercel.app";
const char *ALERT_ID = "";

// Network Configuration
WiFiManager wifiManager;
WiFiClientSecure client;

// Sensor Configurations And Functions

const int PULSE_SENSOR_PIN = A0;
const int PULSE_SENSOR_THRESHOLD = 550;
const int PULSE_SENSOR_INTERVAL_TIMEOUT = 10000; // 10 Seconds

const int BPM_LOW = 55;
const int BPM_HIGH = 110;

float PULSE__Value = 0;
int PULSE__HeartBeat = 0;
boolean PULSE__Counted = false;
int PULSE__IntervalCount = 9;
unsigned long PULSE__MonitorStartTime = 0;

// Watch States
int STATE__ManualTrigButton = 0;

// Tasks
class TASK__AnalogTrigg : public Task {
  public:
    void setup() {
       pinMode(MANUAL_TRIG_BUTTON, INPUT); 
       pinMode(INDICATOR_LED, OUTPUT); 
    }
    void loop() {
      
      digitalWrite(INDICATOR_LED, LOW); 
      
      STATE__ManualTrigButton = digitalRead(MANUAL_TRIG_BUTTON);
      if (STATE__ManualTrigButton) {
        
        digitalWrite(INDICATOR_LED, HIGH);
        sendDataToHost(-1);
        delay(1000);
      }
    }  
} __AnalogTriggTask;

class TASK__PulseSensor : public Task {
  public:
    void loop() {
      
      /*
       * Pulse Sensor doesn't provide accurate reading, so the watch 
       * will monitor the pulse readings for a minute. In one minute 
       * it will take 6 readings and the average of the 6 will be 
       * considered. The sensor is not that accurate and there are some
       * unexpected behaviours with it. So it can be said that an alert will
       * always be a successfull outcome. But the chance of hapenning that is less.
      */

      int PULSE__Counts[6];

      for (int i=0; i<6; i++) {
        PULSE__MonitorStartTime = millis();
        while (millis() < PULSE__MonitorStartTime + PULSE_SENSOR_INTERVAL_TIMEOUT) {
          PULSE__Value = analogRead(PULSE_SENSOR_PIN);
          if (PULSE__Value > PULSE_SENSOR_THRESHOLD && !PULSE__Counted) {
              PULSE__IntervalCount++;
              PULSE__Counted = true;
              delay(50);
          }
          else if (PULSE__Value < PULSE_SENSOR_THRESHOLD) {
            PULSE__Counted = false;  
          }
          yield();  
        }
      
        PULSE__Counts[i] =  PULSE__IntervalCount * 6;
        PULSE__IntervalCount = 0;
        
        __log__("Heart Beat = " + String(PULSE__Counts[i]));
      }

      int PulseSum = 0;
      for (int i=0; i<6; i++) PulseSum += PULSE__Counts[i];
      PULSE__HeartBeat = PulseSum / 6;

      if (PULSE__HeartBeat <= BPM_LOW || PULSE__HeartBeat >= BPM_HIGH)
        sendDataToHost(PULSE__HeartBeat);

      
    }
} __PulseSensorTask;


void setup() {

  if (__DEBUG__)
    Serial.begin(9600); 

  pinMode(BUILTIN_LED, OUTPUT);
  digitalWrite(BUILTIN_LED, HIGH); 

  EEPROM.begin(EEPROM_SIZE);
   
  // On startup check if ALERT ID exists in the memory
  if (char(EEPROM.read(0)) == 'A') {
    for (int i=1; i<=ALERT_ID_LENGTH; i++)
       ALERT_ID +=  char(EEPROM.read(0x0F+i));
  } 

  WiFiManagerParameter alertId("alertid", "Alert ID", ALERT_ID, 40);
  wifiManager.addParameter(&alertId);
  wifiManager.autoConnect(WATCH_HOTSPOT_NAME);
  
  __log__("[WIFI] Connected");
  digitalWrite(BUILTIN_LED, LOW);

  const char *TEMP_ALERT_ID = alertId.getValue();
  if (strlen(TEMP_ALERT_ID) == ALERT_ID_LENGTH && strcmp(TEMP_ALERT_ID, ALERT_ID) != 0) {
    ALERT_ID = TEMP_ALERT_ID;
    EEPROM.write(0, 'A');
    for(int i=1; i <= ALERT_ID_LENGTH; i++) {
      EEPROM.write(0x0F+i, ALERT_ID[i]);
    }
    EEPROM.commit();
  }
  else {
    // Indicate there is an error by glowing the LED
    // and bring the board to a halt state        
    digitalWrite(INDICATOR_LED, HIGH);
    __HALT__;
  }
  
  client.setInsecure();
  
  Scheduler.start(&__AnalogTriggTask);
  Scheduler.start(&__PulseSensorTask);
  Scheduler.begin();
}



void loop() {
  /*
   *  All the tasks [Manual Alert Triggering & Pulse Monitor] are running 
   *  simultaneously as two seperate processes, so loop function is not 
   *  required in this case.
  */ 
}



/*  
 *  Function : sendDataToHost
 *  Sends a GET request to the panicalarm server to 
 *  generate alerts. @param pulse indicates weather it will
 *  be an auto or a manual alert.
 *
*/
void sendDataToHost(int pulse) {
  
  if (!client.connect(API_HOST, 443)) {
    __log__(F("Connection failed"));
    return;
  }
  yield();

  // Send HTTP request
  client.print(F("GET "));
  
  // Pulse < 0 indicates a manual alert.
  // Pulse >= 0 indicates an automatic alert
  if (pulse < 0)  
    client.print("/api/alerts/" + String(ALERT_ID));
  else
    client.print("/api/alerts/" + String(ALERT_ID) + "?pulse=" + pulse);
  client.println(F(" HTTP/1.1"));

  // Headers
  client.print(F("Host: "));
  client.println(API_HOST);
  client.println(F("Cache-Control: no-cache"));

  if (client.println() == 0) {
    __log__(F("Failed to send request"));
    return;
  }

  char status[32] = {0};
  client.readBytesUntil('\r', status, sizeof(status));
  
  if (strcmp(status, "HTTP/1.1 200 OK") != 0) {
    __log__(F("Unexpected response: "));
    __log__(String(status));
    return;
  }

  char endOfHeaders[] = "\r\n\r\n";
  if (!client.find(endOfHeaders)) {
    __log__(F("Invalid response"));
    return;
  }

  /*
   * 
   * This parts reads the response from the GET Request
   * It is not required in Production, as it will increase 
   * the workload on the CPU.
   *
  */

  // Comment this line in production   
  #define __READ_RESPONSE__ 1

  #ifdef __READ_RESPONSE__      
    while (client.available() && client.peek() != '{') {
      char c = 0;
      client.readBytes(&c, 1);
      __log__(String(c));
    }
  
    while (client.available()) {
      char c = 0;
      client.readBytes(&c, 1);
      __log__(String(c));
    }
  #endif
}



/*  
 *  Function : __log__
 *  Logs data to the Serial Monitor only in  
 *  DEBUG or Dev Mode. Using Serial Monitor in
 *  production can cause unexpected behaviour.
 *
*/
void __log__(String msg) {
    if(__DEBUG__){
      Serial.println(msg);  
    }
}
