"use client";

import { ChangeEvent, useEffect, useState } from 'react';



export default function Home() {
  
  const [formData, setFormData] = useState<FormData | null>(null);
  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log(file)
      const data = new FormData();
     
      data.append('file', file);
      data.append('model', 'whisper-1');
      data.append('language', 'en');
      setFormData(data);
      console.log("Formdata set")
      // check if the size is less than 25MB
      if (file.size > 25 * 1024 * 1024) {
        alert("Please upload an audio file less than 25MB");
        return;
      }
    }
  };
  const [convertedText, setConvertedText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const sendAudio = async () => {
    console.log('entering the sendAudio function')
    setLoading(true);
    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", 
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: formData,
    });

    const data = await res.json();
    setLoading(false);
    console.log("entering transcript",data.text)
    setConvertedText(data.text);
  };
  type TextWriterProps = {
    text: string;
    delay: number;
  };
  
  const TextWriter = ({ text, delay }: TextWriterProps) => {
    const [displayText, setDisplayText] = useState("");
    const [index, setIndex] = useState(0);
  
    useEffect(() => {
      const timer = setInterval(() => {
        const currentChar = text.charAt(index);
        const nextChar = text.charAt(index + 1);
        setDisplayText((prevDisplayText) => {
          if (currentChar === "." && nextChar !== " ") {
            return prevDisplayText + currentChar + " ";
          }
          return prevDisplayText + currentChar;
        });
        setIndex((prevIndex) => prevIndex + 1);
      }, delay);
  
      return () => clearInterval(timer);
    }, [text, delay, index]);
  
    return <div>{displayText}</div>;
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
      <div>
        <input
        type="url"
        ></input>
      </div>
      <div>
          <input
            type="file"
            accept="audio/*"
        
           
          />
          <button onClick={sendAudio} >
            Send Audio
            </button>
      </div>
      <TextWriter text={convertedText} delay={10} />
      </div>
    </main>
  )
}
