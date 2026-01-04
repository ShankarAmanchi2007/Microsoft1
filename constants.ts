
import { Project, Developer } from './types';

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Krypton Hub',
    description: 'A global threat intelligence dashboard featuring real-time attack vector visualization and predictive analytics.',
    fullDescription: 'Krypton Hub is a mission-critical cybersecurity command center. It visualizes global data traffic, identifies malicious patterns using machine learning, and provides a centralized interface for multi-region defense protocols. Built for high-stakes monitoring environments.',
    problemStatement: "Security teams often struggle with fragmented data sources and lack a 'single pane of glass' for global network health and threat detection.",
    solutionStatement: 'By aggregating multi-chain and multi-region data into a high-performance WebGL-driven interface, Krypton Hub enables sub-second response times to emerging cyber threats.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
    techStack: ['WebGL', 'React', 'Node.js', 'Redis'],
    isPaid: true,
    price: 499,
    demoUrl: '#',
    authorId: 'dev3',
    authorName: 'Marcus Volt',
    authorAvatar: 'https://i.pravatar.cc/150?u=dev3',
    views: 24500
  },
  {
    id: '7',
    title: 'NovaCV AI',
    description: 'An intelligent resume architect that generates high-impact, ATS-optimized professional profiles.',
    fullDescription: 'NovaCV AI leverages advanced LLMs to transform messy career histories into polished, recruiter-ready resumes. It features real-time optimization, keyword density analysis, and professional formatting presets designed for the modern job market.',
    problemStatement: 'Crafting a resume that passes automated filters (ATS) and catches recruiter attention is a time-consuming, repetitive task for job seekers.',
    solutionStatement: 'A smart editor that uses AI to suggest impactful bullet points and optimizes layout for readability and machine parsing.',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=1200',
    techStack: ['React', 'Gemini API', 'Tailwind', 'Framer Motion'],
    isPaid: false,
    demoUrl: '#',
    authorId: 'dev1',
    authorName: 'Alex Rivera',
    authorAvatar: 'https://i.pravatar.cc/150?u=dev1',
    views: 15600
  },
  {
    id: '2',
    title: 'GlitchArt Studio',
    description: 'Real-time GPU-accelerated video processing tool for digital artists and VJs.',
    fullDescription: 'GlitchArt Studio brings professional-grade visual effects to the web. It allows users to upload video content or use a live camera feed to apply complex shaders in real-time. Ideal for music videos, live performances, and social media content creation.',
    problemStatement: 'Video manipulation usually requires heavy desktop software and significant processing power, making quick creative iterations difficult.',
    solutionStatement: 'Utilizing WebGL and custom GLSL shaders, GlitchArt Studio offloads processing to the user\'s GPU, enabling instant feedback and high-fidelity effects directly in the browser.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200',
    techStack: ['WebGL', 'Three.js', 'React', 'GLSL'],
    isPaid: false,
    demoUrl: '#',
    authorId: 'dev2',
    authorName: 'Sarah Chen',
    authorAvatar: 'https://i.pravatar.cc/150?u=dev2',
    views: 8900
  },
  {
    id: '3',
    title: 'Sentinel Ledger',
    description: 'High-security multi-signature wallet dashboard for DAO governance.',
    fullDescription: 'Sentinel Ledger is a premium Web3 interface designed for organizations managing shared treasuries. It focuses on clarity, security, and auditability, allowing multi-sig members to propose, vote on, and execute transactions across multiple chains.',
    problemStatement: 'Managing institutional crypto assets is often cumbersome and prone to user error due to poorly designed technical interfaces.',
    solutionStatement: 'A streamlined, "security-first" dashboard that abstracts away complex blockchain interactions while providing crystal-clear transaction simulation and hardware wallet integration.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200',
    techStack: ['Ethers.js', 'TypeScript', 'Next.js', 'Wagmi'],
    isPaid: true,
    price: 299,
    demoUrl: '#',
    authorId: 'dev3',
    authorName: 'Marcus Volt',
    authorAvatar: 'https://i.pravatar.cc/150?u=dev3',
    views: 5400
  }
];

export const MOCK_DEVELOPERS: Developer[] = [
  {
    id: 'dev1',
    name: 'Alex Rivera',
    avatar: 'https://i.pravatar.cc/150?u=dev1',
    skills: ['React', 'System Architecture', 'UI/UX', 'Cloud Infrastructure', 'Node.js', 'PostgreSQL'],
    bio: 'Crafting polished digital experiences that bridge the gap between imagination and execution. Specialized in complex SaaS architectures and fluid, desktop-grade web interfaces.',
    github: 'https://github.com/alexrivera',
    contactEmail: 'alex@buildspace.com',
    projects: MOCK_PROJECTS.filter(p => p.authorId === 'dev1'),
    rank: 'Top 1% Global',
    achievements: [
      { title: 'Zero Latency Engine', description: 'Optimized real-time data sync for enterprise dashboards by 60%.', icon: '⚡' },
      { title: 'Open Source Visionary', description: 'Contributor to 10+ major React libraries with 5k+ stars.', icon: '🌟' },
      { title: 'Security Architect', description: 'Designed end-to-end encryption for 3 unicorn fintech apps.', icon: '🛡️' }
    ],
    rewards: [
      { name: 'Architect of the Year', year: '2024', platform: 'BuildSpace' },
      { name: 'Most Innovative UI', year: '2023', platform: 'DevConf' },
      { name: '100+ Verified Deployments', year: '2024', platform: 'AWS' }
    ]
  },
  {
    id: 'dev2',
    name: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?u=dev2',
    skills: ['WebGL', 'Motion Graphics', 'Creative Coding', 'Data Viz', 'Three.js', 'Rust'],
    bio: 'Pushing the boundaries of what is possible in the browser. I build immersive, interactive visual tools, generative art, and high-performance data visualizations.',
    github: 'https://github.com/schen',
    contactEmail: 'sarah@buildspace.com',
    projects: MOCK_PROJECTS.filter(p => p.authorId === 'dev2'),
    rank: 'Visual Master',
    achievements: [
      { title: '60FPS WebGL Renderer', description: 'Built a browser engine capable of rendering 1M+ polygons smoothly.', icon: '🎨' },
      { title: 'Creative Coding Lead', description: 'Spearheaded the visual identity for 3 major digital art festivals.', icon: '🎭' }
    ],
    rewards: [
      { name: 'Best Visual Design', year: '2024', platform: 'Awwwards' },
      { name: 'Top Creative Tech', year: '2023', platform: 'GitHub Universe' }
    ]
  },
  {
    id: 'dev3',
    name: 'Marcus Volt',
    avatar: 'https://i.pravatar.cc/150?u=dev3',
    skills: ['Security', 'Blockchain', 'Rust', 'Systems Engineering', 'Solidity', 'Go'],
    bio: 'Building robust, secure foundations for the next generation of the web. My focus is on high-performance systems, cryptographic integrity, and privacy-preserving architectures.',
    github: 'https://github.com/mvolt',
    contactEmail: 'marcus@buildspace.com',
    projects: MOCK_PROJECTS.filter(p => p.authorId === 'dev3'),
    rank: 'Systems Expert',
    achievements: [
      { title: 'Multi-Chain Protocol', description: 'Designed a cross-chain liquidity bridge with $20M+ TVL.', icon: '⛓️' },
      { title: 'Privacy First Auth', description: 'Authored a zero-knowledge proof library for mobile authentication.', icon: '🗝️' }
    ],
    rewards: [
      { name: 'Web3 Innovator', year: '2024', platform: 'EthGlobal' },
      { name: 'Secure System Award', year: '2023', platform: 'DefCon' }
    ]
  }
];
