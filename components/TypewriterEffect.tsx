"use client";

import React, { useState, useEffect } from 'react';

interface TypewriterEffectProps {
  text: string;
  delay: number;
  startDelay?: number;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({ text, delay, startDelay = 0 }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsStarted(true), startDelay);
    return () => clearTimeout(timer);
  }, [startDelay]);

  useEffect(() => {
    if (!isStarted) return;

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      // เมื่อพิมพ์จบ รอ 3 วินาทีแล้วหยุดการกระพริบและซ่อนตัวตน
      const timeout = setTimeout(() => setShowCursor(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text, isStarted]);

  return (
    <span className="inline-flex items-center">
      {currentText || "\u00A0"}
      
      {/* แก้ไขตรงนี้: 
         - ใช้ opacity เพื่อซ่อนแทนการลบ Element ออกไปเลย 
         - ใช้ animate-blink เฉพาะตอนที่ยังพิมพ์ไม่เสร็จ หรือตอนที่ต้องการให้กระพริบ
      */}
      <span 
        className={`ml-1 text-orange-500 font-light transition-opacity duration-500 ${
          isStarted && showCursor ? "opacity-100 animate-blink" : "opacity-0"
        }`}
      >
        |
      </span>
    </span>
  );
};

export default TypewriterEffect;