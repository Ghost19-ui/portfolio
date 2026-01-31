import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CyberGlobe = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    
    // 1. SETUP SCENE (Black Void)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.002); 

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 450; 

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 2. INNER CORE (Solid Black Sphere - Blocks background lines)
    const coreGeometry = new THREE.IcosahedronGeometry(119, 2);
    const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const coreSphere = new THREE.Mesh(coreGeometry, coreMaterial);
    globeGroup.add(coreSphere);

    // 3. OUTER WIREFRAME (Bright Red - Like Reference)
    const wireGeometry = new THREE.IcosahedronGeometry(120, 2);
    const wireMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff0f39, // Intense Red
      wireframe: true,
      transparent: true,
      opacity: 0.6, 
    });
    const wireSphere = new THREE.Mesh(wireGeometry, wireMaterial);
    globeGroup.add(wireSphere);

    // 4. GLOWING NODES (The Cities/Servers)
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 150;
    const posArray = new Float32Array(particleCount * 3);

    for(let i = 0; i < particleCount; i++) {
        // Distribute points on surface
        const phi = Math.acos( -1 + ( 2 * i ) / particleCount );
        const theta = Math.sqrt( particleCount * Math.PI ) * phi;
        const r = 120.5; // Slightly above surface
        
        posArray[i*3] = r * Math.cos(theta) * Math.sin(phi);
        posArray[i*3+1] = r * Math.sin(theta) * Math.sin(phi);
        posArray[i*3+2] = r * Math.cos(phi);
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 3,
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    globeGroup.add(particlesMesh);

    // 5. ANIMATION
    let mouseX = 0;
    let mouseY = 0;

    const animate = () => {
      requestAnimationFrame(animate);
      globeGroup.rotation.y += 0.002; // Constant spin
      
      // Mouse interaction
      globeGroup.rotation.y += mouseX * 0.0005;
      globeGroup.rotation.x += mouseY * 0.0005;

      renderer.render(scene, camera);
    };
    animate();

    const handleMouseMove = (event) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
    };
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if(container && renderer.domElement) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1,
        background: 'radial-gradient(circle at center, #1a0505 0%, #000000 70%)' // Deep Red-Black Gradient
    }} />
  );
};

export default CyberGlobe;