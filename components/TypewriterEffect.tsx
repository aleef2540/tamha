"use client";

import React, { useState, useEffect } from 'react';

interface TypewriterEffectProps {
  text: string;
  delay: number;
  startDelay?: number; // เพิ่มตัวเลือกการหน่วงเวลาเริ่มต้น
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({ text, delay, startDelay = 0 }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isStarted, setIsStarted] = useState(false);

  // จัดการการหน่วงเวลาก่อนเริ่มพิมพ์
  useEffect(() => {
    const startTimeout = setTimeout(() => setIsStarted(true), startDelay);
    return () => clearTimeout(startTimeout);
  }, [startDelay]);

  useEffect(() => {
    if (!isStarted) return; // ถ้ายังไม่ถึงเวลาเริ่ม ให้หยุดไว้ก่อน

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setShowCursor(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text, isStarted]);

  return (
    <span className="inline-flex items-center">
      {/* ถ้ายังไม่เริ่มพิมพ์ ให้โชว์ช่องว่างเพื่อให้ขนาด Span ไม่ยุบ */}
      {currentText || "\u00A0"} 
      {isStarted && showCursor && (
        <span className="ml-1 animate-blink text-orange-500 font-light">|</span>
      )}
    </span>
  );
};

export default TypewriterEffect;