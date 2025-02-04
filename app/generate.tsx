import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from "react-native";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import config from "../config.js"

export const generateSchedule = async (inputs: string[], changes?: string): Promise<String> => {
    const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({model: config.GEMINI_API_MODEL});

        const template = 
            "Using the this JSON template:" + 
            "{" + 
                '"schedule": [' +
                '{' +
                    '"id": "x",' +
                    '"title": "xxx",' +
                    '"description": "xxxx",' +
                    '"week_day": "xxx",' +
                    '"start_time": "2025-01-18T09:00:00",' +
                    '"end_time": "2025-01-18T10:00:00"' +
                '}' +
                ']'+
            '}'+ 
            'Have each event have its own id if they are on different days (even if they have the same name).' + 
            'Please generate a weekly schedule that fits all of these events in: "' +
            inputs.join(", ") +
            'NOTE: Do not include anything other than the JSON text in your response. I need to be able to parse it directly. Also send as a normal text response not formatted' +
            "Also, i'd like to add some of these changes. feel free to override some of the inputs i put before if they contradict: " + changes + 
            "remember to send as a normal text response. i do not want it formatted! Also do not include anything i have not specifically stated.";

        var result = "ERROR2";
        await queryGemini(model, template).then((response) => {
            result = response.response.candidates[0].content.parts[0].text;
        })
        .catch((error) => {
            console.error("Error generating schedule: ", error);
        });

        return result;
    };

    const queryGemini = async (model: any, inputValue: string) => {
        console.log("querying gemini on input: " + inputValue);
        const result = await model.generateContent(inputValue);
        return result;
      };