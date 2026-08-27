#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "ld2410.h"
#include "private.h"

#define LED_PIN 2 

HardwareSerial radarSerial(2);
ld2410 radar;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(115200);

  Serial.println("Connecting to wifi...");

  WiFi.begin(WIFI_SSID, WIFI_PASS);

  while (WiFi.status() != WL_CONNECTED) 
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("Connected to wifi.");

  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  radarSerial.begin(256000, SERIAL_8N1, 16, 17);

  Serial.println("Starting LD2410C...");

  if (radar.begin(radarSerial)) 
  {
    Serial.println("LD2410C connected");
  } else 
  {
    Serial.println("LD2410C not detected");
  }
}

bool firstReading = true;
bool lastOccupied = false;

void loop() {
  
  /*
  radar.read();

  if (radar.presenceDetected()) 
  {
    Serial.println("Presence detected");
    digitalWrite(LED_PIN, HIGH);
  } 
  else 
  {
    Serial.println("No presence");
    digitalWrite(LED_PIN, LOW);
  }

  delay(500);
  */

  radar.read();

  bool occupied = radar.presenceDetected();
  float distance = (radar.detectionDistance() / 100.0f);

  if (radar.presenceDetected()) 
  {
    digitalWrite(LED_PIN, HIGH);
  }
  else
  {
    digitalWrite(LED_PIN, LOW);
  }

  if ((firstReading || lastOccupied) != occupied)
  {
    Serial.println("--------------------------------");
    Serial.print("Occupied: ");
    
    if (occupied) 
    {
      Serial.println("YES");
    } 
    else 
    {
      Serial.println("NO");
    }

    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" m");

    if (WiFi.status() == WL_CONNECTED)
    {
      HTTPClient http;

      http.begin(API_URL);
      http.addHeader("Content-Type", "application/json");

      String json = "{";

      json += "\"room_id\":";  
      json += ROOM_ID;                
      json += ",";                    

      json += "\"occupied\":";
      if (occupied) 
      {
        json += "true";
      } 
      else 
      {
        json += "false";
      }

      json += ",";
      json += "\"distance\":";
      json += String(distance, 2);
      json += "}";

      Serial.println("Sending:");
      Serial.println(json);

      int response = http.POST(json);

      Serial.print("HTTP Response: ");
      Serial.println(response);

      http.end();
    }

    lastOccupied = occupied;
    firstReading = false;

  }
}