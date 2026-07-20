export const experience = [
  {
    date: "May–Aug 2026",
    role: "AI Robotics Engineer Intern",
    place: "Acceleration Consortium",
    bullets: [
      "Built Isaac Sim digital twins used to collect more than 2,000 demonstrations for imitation and reinforcement learning.",
      "Fine-tuned and deployed OpenPi policies that achieved a 99%+ success rate selecting visually identical objects; also built voice-assisted data collection and stereo VR teleoperation pipelines.",
    ],
    tools: ["Isaac Sim", "OpenPi", "SAM 2", "PyTorch", "JAX", "CloudXR", "ZED SDK"],
  },
  {
    date: "Sep 2025–Apr 2026",
    role: "Autonomous Rover Embedded Engineer",
    place: "University of Toronto Robotics Association",
    bullets: [
      "Refactored the rover fault monitor into a FreeRTOS task architecture, improving execution throughput by 7.7×.",
      "Built a ROS 2 and PyQt operator interface that reduced rover operation time by 67%, plus a GPS/IMU analysis pipeline with covariance propagation.",
    ],
    tools: ["C++", "FreeRTOS", "ROS 2", "PyQt5", "Python", "ESP32"],
  },
  {
    date: "Sep 2024–Jun 2025",
    role: "National Director of Design",
    place: "Hot Potato Initiative",
    bullets: [
      "Led a team of 10 producing digital and physical material for national advocacy campaigns that increased outreach by 35%.",
    ],
    tools: ["Design", "Project management", "Cross-team collaboration"],
  },
];

export const projects = [
  {
    title: "AroundU",
    type: "Campus social platform",
    description: "Built onboarding, event discovery, messaging, a Google Maps heatmap, and an embedding-based profile recommendation pipeline.",
    tools: ["React", "TypeScript", "Node.js", "Supabase", "OpenAI API"],
  },
  {
    title: "Fast and Flurrious",
    type: "Autonomous rover",
    description: "Built PID line following, concurrent FreeRTOS control tasks, obstacle avoidance, and autonomous object pickup and placement.",
    tools: ["C++", "FreeRTOS", "Arduino", "PID control"],
  },
];

export const education = {
  school: "University of Toronto",
  degree: "BASc Engineering Science · Robotics focus · Co-op",
  gpa: "3.8 / 4.0",
  award: "$10,000 University of Toronto Scholars Scholarship",
};
