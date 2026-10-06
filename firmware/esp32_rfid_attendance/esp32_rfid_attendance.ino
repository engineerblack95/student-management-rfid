/* =====================================================================
 *  SAN TECH HUB — RFID ATTENDANCE SYSTEM
 *  ESP32 + MFRC522 + LEDs + Buzzer + Wi-Fi
 *  ---------------------------------------------------------------------
 *  Reads RFID UID → POSTs to Node.js backend → controls LEDs + buzzer
 *  Endpoint: POST http://<PC_IP>:5000/api/attendance/scan
 * =====================================================================
 *  WIRING:
 *    MFRC522:  SDA=5  SCK=18  MOSI=23  MISO=19  RST=22  VCC=3.3V  GND=GND
 *    Green LED  -> GPIO 32 (via 220Ω to GND)
 *    Yellow LED -> GPIO 33 (via 220Ω to GND)
 *    Red LED    -> GPIO 25 (via 220Ω to GND)
 *    Buzzer +   -> GPIO 26  (Buzzer − to GND)
 * =====================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <ArduinoJson.h>

// ======================  ⚠️ EDIT THESE 4 LINES  ⚠️  ====================
const char* WIFI_SSID     = "YOUR_WIFI_NAME";       // ← your Wi-Fi name
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";   // ← your Wi-Fi password
const char* SERVER_URL    = "http://192.168.1.100:5000/api/attendance/scan";
                                                     // ↑ replace with YOUR PC's IPv4
const char* DEVICE_ID     = "RFID-READER-001";      // keep as-is
// =====================================================================

// ---------------- Pin definitions ----------------
#define SS_PIN    5
#define RST_PIN   22

#define LED_GREEN   32
#define LED_YELLOW  33
#define LED_RED     25
#define BUZZER_PIN  26

MFRC522 mfrc522(SS_PIN, RST_PIN);

// ---------------- Indicator helpers ----------------
void allOff() {
  digitalWrite(LED_GREEN,  LOW);
  digitalWrite(LED_YELLOW, LOW);
  digitalWrite(LED_RED,    LOW);
}

void indicateReady() {
  allOff();
}

void indicateProcessing() {
  allOff();
  digitalWrite(LED_YELLOW, HIGH);
}

void indicateSuccess() {
  allOff();
  digitalWrite(LED_GREEN, HIGH);
  tone(BUZZER_PIN, 2000, 150);   // 1 short beep
}

void indicateUnknownCard() {
  allOff();
  digitalWrite(LED_RED, HIGH);
  tone(BUZZER_PIN, 1000, 150); delay(200);
  tone(BUZZER_PIN, 1000, 150);   // 2 short beeps
}

void indicateError() {
  allOff();
  digitalWrite(LED_RED, HIGH);
  tone(BUZZER_PIN, 800, 800);    // 1 long beep
}

// ---------------- Wi-Fi ----------------
void connectWiFi() {
  Serial.print("📶 Connecting to WiFi: ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 20000) {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("✅ WiFi connected");
    Serial.print("   IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println();
    Serial.println("❌ WiFi failed — will retry");
  }
}

// ---------------- Read UID ----------------
String readUid() {
  String uid = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if (mfrc522.uid.uidByte[i] < 0x10) uid += "0";
    uid += String(mfrc522.uid.uidByte[i], HEX);
  }
  uid.toUpperCase();
  return uid;
}

// ---------------- POST to backend ----------------
void sendScan(String uid) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️  WiFi lost — reconnecting...");
    connectWiFi();
    if (WiFi.status() != WL_CONNECTED) {
      indicateError();
      return;
    }
  }

  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(8000);

  // Build JSON body
  StaticJsonDocument<200> doc;
  doc["deviceId"] = DEVICE_ID;
  doc["rfidUid"]  = uid;
  String body;
  serializeJson(doc, body);

  Serial.println("📤 POST " + String(SERVER_URL));
  Serial.println("   Body: " + body);

  int httpCode = http.POST(body);

  if (httpCode > 0) {
    String response = http.getString();
    Serial.println("📥 HTTP " + String(httpCode));
    Serial.println("   " + response);

    // Parse response
    StaticJsonDocument<512> resp;
    DeserializationError err = deserializeJson(resp, response);

    if (!err) {
      bool success = resp["success"] | false;
      String msg = resp["message"] | "";

      if (success) {
        indicateSuccess();
        Serial.println("✅ Attendance recorded");
        if (resp["student"]["name"]) {
          Serial.print("   Student: ");
          Serial.println(resp["student"]["name"].as<String>());
        }
      } else {
        // Rejected by server (unknown / disabled / duplicate)
        if (msg.indexOf("Duplicate") >= 0) {
          // Green solid + silent (still present)
          allOff();
          digitalWrite(LED_GREEN, HIGH);
          Serial.println("ℹ️  Duplicate scan — already recorded");
        } else {
          indicateUnknownCard();
          Serial.println("❌ Rejected: " + msg);
        }
      }
    } else {
      indicateError();
      Serial.println("❌ JSON parse error");
    }
  } else {
    Serial.println("❌ HTTP error: " + String(httpCode));
    indicateError();
  }

  http.end();
}

// ====================== SETUP ======================
void setup() {
  Serial.begin(115200);
  delay(500);

  Serial.println();
  Serial.println("======================================");
  Serial.println(" SAN TECH HUB — RFID Attendance");
  Serial.println("======================================");

  // Pin modes
  pinMode(LED_GREEN,  OUTPUT);
  pinMode(LED_YELLOW, OUTPUT);
  pinMode(LED_RED,    OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  allOff();

  // SPI + MFRC522
  SPI.begin();
  mfrc522.PCD_Init();
  delay(100);
  byte v = mfrc522.PCD_ReadRegister(MFRC522::VersionReg);
  Serial.print("🔧 MFRC522 version: 0x");
  Serial.println(v, HEX);
  if (v == 0x00 || v == 0xFF) {
    Serial.println("❌ MFRC522 not detected — check wiring!");
  } else {
    Serial.println("✅ MFRC522 ready");
  }

  // Wi-Fi
  connectWiFi();

  indicateReady();
  Serial.println("🎫 Ready — tap a card...");
  Serial.println();
}

// ====================== LOOP ======================
void loop() {
  // Reconnect WiFi if dropped
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("🔄 Wi-Fi dropped, reconnecting...");
    connectWiFi();
  }

  // Wait for new card
  if (!mfrc522.PICC_IsNewCardPresent()) return;
  if (!mfrc522.PICC_ReadCardSerial())   return;

  indicateProcessing();

  String uid = readUid();
  Serial.println("🎫 Card detected: " + uid);

  sendScan(uid);

  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();

  // Let indicators stay on for a moment, then back to Ready
  delay(1200);
  indicateReady();

  delay(500);  // debounce
}