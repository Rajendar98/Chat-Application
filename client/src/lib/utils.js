import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import animationData from "@/assets/lottie-json";
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  "bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff00gfaa]", // Color 0
  "bg-[#1d4e89] text-[#f9c74f] border-[1px] border-[#f9844a]", // Color 1
  "bg-[#ffbe0b] text-[#3a86ff] border-[1px] border-[#8338ec]", // Color 2
  "bg-[#ff006e] text-[#fff] border-[1px] border-[#f0f]" , // Color 3
  "bg-[#5b9e8f] text-[#fff] border-[1px] border-[#4a4a4a]", // Color 4
  "bg-[#ffcc29] text-[#d8336b] border-[1px] border-[#2e2e2e]"  // Color 5
];


export const getColor = (color)=>{
  if(color>=0 && color<colors.length){
    return colors[color];
  }
  return colors[0]
}

export const animationDefaultOptions = {
  loop:true,
  autoplay:true,
  animationData,
}