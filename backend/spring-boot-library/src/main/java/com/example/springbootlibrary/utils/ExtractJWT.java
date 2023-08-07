package com.example.springbootlibrary.utils;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class ExtractJWT {

    // JWT'den payload verisini belirli bir anahtarla çıkarmak için kullanılan fonksiyon
    public static String payloadJWTExtraction(String token, String extraction) {

        // Bearer anahtarını token'dan kaldırmak için replace metodunu kullanıyoruz
        token.replace("Bearer ", "");

        // JWT token'ını üç kısma (header, payload, signature) ayırmak için '.' karakterine göre parçalıyoruz
        String[] chunks = token.split("\\.");
        Base64.Decoder decoder = Base64.getUrlDecoder();

        // Payload'ı almak için Base64 decode işlemi yapıyoruz
        String payload = new String(decoder.decode(chunks[1]));

        // Payload içindeki verileri key-value çiftlerine dönüştürüyoruz ve bir Map nesnesine saklıyoruz
        String[] entries = payload.split(",");
        Map<String, String> map = new HashMap<String, String>();

        for (String entry : entries) {
            String[] keyValue = entry.split(":");
            if (keyValue[0].equals(extraction)) {

                // JSON değerlerinde başta ve sonda süslü parantezler ({}) olabilir.
                // Bu parantezler varsa kaldırarak sadece değeri alıyoruz.
                int remove = 1;
                if (keyValue[1].endsWith("}")) {
                    remove = 2;
                }
                keyValue[1] = keyValue[1].substring(0, keyValue[1].length() - remove);
                keyValue[1] = keyValue[1].substring(1);

                map.put(keyValue[0], keyValue[1]);
            }
        }
        // Belirtilen anahtarla eşleşen bir değer varsa onu döndürüyoruz
        if (map.containsKey(extraction)) {
            return map.get(extraction);
        }
        // Eşleşen değer yoksa null döndürüyoruz
        return null;
    }
}


