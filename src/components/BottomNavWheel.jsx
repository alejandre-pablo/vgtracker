import React, { useEffect, useState, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export default function CategorySlider({ categories, activeTab, setActiveTab }) {
  const activeIndex = categories.findIndex(cat => cat.key === activeTab);
  const [currentSlide, setCurrentSlide] = useState(activeIndex >= 0 ? activeIndex : 0);

  // Ref to ignore slideChanged on programmatic moves
  const ignoreSlideChange = useRef(false);

  const [sliderRef, slider] = useKeenSlider({
    slides: {
      perView: 5,
      origin: "center",
    },
    loop: false,
    initial: activeIndex >= 0 ? activeIndex : 0,
    slideChanged: (s) => {
      if (ignoreSlideChange.current) {
        // Reset flag and ignore this event
        ignoreSlideChange.current = false;
        return;
      }
      handleSlideChange(s);
    },
  });

  function handleSlideChange(s) {
    const newIndex = s.track.details.rel;
    setCurrentSlide(newIndex);
    setActiveTab(categories[newIndex].key);
  }

  function handleOnClick(idx, cat) {
    if (idx !== currentSlide) {
      ignoreSlideChange.current = true;
      slider.current?.moveToIdx(idx);
      setActiveTab(cat.key);
    }
  }

  useEffect(() => {
    if (slider.current) {
      const newIndex = categories.findIndex(cat => cat.key === activeTab);
      if (newIndex >= 0 && newIndex !== currentSlide) {
        ignoreSlideChange.current = true;
        slider.current.moveToIdx(newIndex);
        setCurrentSlide(newIndex);
      }
    }
  }, [activeTab, categories, currentSlide, slider, setActiveTab]);

  return (
    <div ref={sliderRef} className="keen-slider">
      {categories.map((cat, idx) => (
        <div
          key={cat.key}
          className={`keen-slider__slide ${currentSlide === idx ? "active" : ""}`}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            transition: "transform 0.1s, opacity 0.1s",
            color: "white",
            width: "100%",
            opacity: currentSlide === idx ? 1 : 0.5,
            fontSize: currentSlide === idx ? "0.7rem" : "0.6rem",
            fontWeight: currentSlide === idx ? "bold" : "normal",
          }}
          onClick={() => {
            handleOnClick(idx, cat);
          }}
        >
            <div className="bottomMenuMobileItem">
                <cat.icon style={{fontSize: currentSlide === idx ? "1.3rem" : "1rem", marginBottom: '0.2rem'}}/>
                <span>{cat.label}</span>
            </div>  
        </div>
      ))}
    </div>
  );
}
