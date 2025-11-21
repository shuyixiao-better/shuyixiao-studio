<script setup>
import { withBase } from 'vitepress'

const funFacts = [
  "Did you know? The first computer bug was an actual moth.",
  "404 is the HTTP status code for 'Not Found'.",
  "Pandas spend 10-16 hours a day eating bamboo.",
  "You might have typed the URL wrong, or the page moved.",
  "Even the best code has bugs sometimes!"
]

const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)]
</script>

<template>
  <div class="not-found-container">
    <div class="panda-illustration">
      <!-- Simple CSS/SVG Panda Face -->
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="90" fill="#f2f2f2" />
        <!-- Ears -->
        <circle cx="35" cy="50" r="25" fill="#333" />
        <circle cx="165" cy="50" r="25" fill="#333" />
        <!-- Eyes -->
        <ellipse cx="65" cy="90" rx="25" ry="35" fill="#333" transform="rotate(-15 65 90)" />
        <ellipse cx="135" cy="90" rx="25" ry="35" fill="#333" transform="rotate(15 135 90)" />
        <circle cx="65" cy="85" r="5" fill="white" />
        <circle cx="135" cy="85" r="5" fill="white" />
        <!-- Nose -->
        <ellipse cx="100" cy="125" rx="15" ry="10" fill="#333" />
        <!-- Mouth (Confused) -->
        <path d="M 85 145 Q 100 135 115 145" stroke="#333" stroke-width="3" fill="none" />
        <!-- Question Marks -->
        <text x="150" y="50" font-size="40" fill="#646cff" style="animation: float 3s infinite ease-in-out;">?</text>
        <text x="30" y="150" font-size="30" fill="#42d392" style="animation: float 4s infinite ease-in-out 1s;">?</text>
      </svg>
    </div>
    
    <h1 class="not-found-title">404 - Page Not Found</h1>
    <p class="not-found-desc">
      Oops! It seems you've wandered into the bamboo forest where there are no pages.
      <br>
      <span style="font-size: 0.9em; opacity: 0.8; display: block; margin-top: 10px;">
        <em>Fun Fact: {{ randomFact }}</em>
      </span>
    </p>
    
    <a :href="withBase('/')" class="action-button">
      Take Me Home
    </a>
  </div>
</template>

<style scoped>
/* Styles are largely handled in custom.css for global availability, 
   but scoped styles can be added here if needed for specific component isolation. */
</style>
