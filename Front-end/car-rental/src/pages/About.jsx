import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three'; // CORRECTED IMPORT PATH to the standard 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function About() {
  const mountRef = useRef(null); // Ref for the canvas container

  useEffect(() => {
    // 3D Scene Setup
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true for transparent background
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Add OrbitControls for interactive camera movement
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when damping is enabled
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 15;
    controls.maxPolarAngle = Math.PI / 2;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // Simple Car Model (Abstract Representation)
    const carGroup = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.BoxGeometry(4, 1, 1.5);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x007bff, metalness: 0.5, roughness: 0.3 }); // Blue, metallic
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    carGroup.add(body);

    // Cabin
    const cabinGeometry = new THREE.BoxGeometry(2.5, 0.8, 1.3);
    const cabinMaterial = new THREE.MeshStandardMaterial({ color: 0x343a40, metalness: 0.5, roughness: 0.3 }); // Dark gray
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.set(0, 1.8, 0);
    carGroup.add(cabin);

    // Wheels (simplified cylinders)
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.5 });

    const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel1.rotation.z = Math.PI / 2;
    wheel1.position.set(1.5, 0.5, 0.8);
    carGroup.add(wheel1);

    const wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel2.rotation.z = Math.PI / 2;
    wheel2.position.set(-1.5, 0.5, 0.8);
    carGroup.add(wheel2);

    const wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel3.rotation.z = Math.PI / 2;
    wheel3.position.set(1.5, 0.5, -0.8);
    carGroup.add(wheel3);

    const wheel4 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel4.rotation.z = Math.PI / 2;
    wheel4.position.set(-1.5, 0.5, -0.8);
    carGroup.add(wheel4);

    scene.add(carGroup);

    camera.position.z = 8;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const onWindowResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', onWindowResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
      bodyGeometry.dispose();
      bodyMaterial.dispose();
      cabinGeometry.dispose();
      cabinMaterial.dispose();
      wheelGeometry.dispose();
      wheelMaterial.dispose();
      scene.traverse((object) => {
        if (!object.isMesh) return;
        object.geometry.dispose();
        object.material.dispose();
      });
    };
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  const textFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const imageScaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const cardSlideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 12 } }
  };

  return (
    <motion.section
      className="text-gray-600 body-font bg-white min-h-screen pt-24"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {/* Hero Section - About Us */}
      <div className="container mx-auto flex px-5 py-12 md:flex-row flex-col items-center">
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
          <motion.img
            className="object-cover object-center rounded-lg shadow-xl"
            alt="About Us Image"
            src="https://images.unsplash.com/photo-1518306727298-4c17e1bf6942?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODV8fGNhcnxlbnwwfHwwfHx8MA%3D%3D"
            variants={imageScaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          />
        </div>
        <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
          <motion.h1
            className="title-font sm:text-4xl text-3xl mb-4 font-extrabold text-gray-900"
            variants={textFadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            About GearGo: Your Journey, Our Passion
          </motion.h1>
          <motion.p
            className="mb-4 leading-relaxed text-lg text-gray-700"
            variants={textFadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            At GearGo, we believe that every journey should be an experience, not just a trip. Founded in [Year of Founding, e.g., 2010] with a passion for mobility and a commitment to exceptional service, we've grown to become a trusted name in car rentals across Pakistan. Our mission is to provide seamless, reliable, and enjoyable car rental solutions that empower you to explore with freedom and confidence, whether for business or leisure.
          </motion.p>
          <motion.p
            className="mb-8 leading-relaxed text-lg text-gray-700"
            variants={textFadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            From our meticulously maintained fleet of diverse vehicles to our dedicated 24/7 customer support, every aspect of GearGo is designed with your convenience and safety in mind. We pride ourselves on transparent pricing, easy booking processes, and a personalized approach to meet your unique needs. We're more than just a car rental company; we're your partner in adventure, business, and everyday life, committed to making every mile memorable.
          </motion.p>
        </div>
      </div>

      {/* Mission, Vision, Values Section */}
      <div className="container px-5 py-12 mx-auto">
        <div className="flex flex-wrap -m-4 text-center">
          <motion.div
            className="p-4 md:w-1/3 sm:w-1/2 w-full"
            variants={cardSlideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <div className="border-2 border-gray-200 px-4 py-6 rounded-lg shadow-md bg-gray-50 hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
              <h2 className="title-font font-bold text-xl text-gray-900 mb-2">Our Mission</h2>
              <p className="leading-relaxed text-gray-700">To provide accessible, reliable, and high-quality car rental services that enhance our customers' travel experiences.</p>
            </div>
          </motion.div>
          <motion.div
            className="p-4 md:w-1/3 sm:w-1/2 w-full"
            variants={cardSlideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <div className="border-2 border-gray-200 px-4 py-6 rounded-lg shadow-md bg-gray-50 hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
              <h2 className="title-font font-bold text-xl text-gray-900 mb-2">Our Vision</h2>
              <p className="leading-relaxed text-gray-700">To be the leading car rental choice, recognized for our exceptional service, diverse fleet, and commitment to customer satisfaction.</p>
            </div>
          </motion.div>
          <motion.div
            className="p-4 md:w-1/3 sm:w-1/2 w-full"
            variants={cardSlideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <div className="border-2 border-gray-200 px-4 py-6 rounded-lg shadow-md bg-gray-50 hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
              <h2 className="title-font font-bold text-xl text-gray-900 mb-2">Our Values</h2>
              <p className="leading-relaxed text-gray-700">Integrity, customer focus, innovation, and a passion for quality drive everything we do.</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 3D Model Section */}
      <section className="text-gray-600 body-font bg-gray-100 py-24">
        <div className="container px-5 mx-auto text-center">
          <motion.h2
            className="text-4xl font-extrabold title-font text-gray-900 mb-8 tracking-tight"
            variants={textFadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            Explore Our Vision in 3D
          </motion.h2>
          <motion.div
            ref={mountRef}
            className="w-full h-[500px] bg-gray-200 rounded-lg shadow-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Three.js canvas will be appended here */}
          </motion.div>
          <motion.p
            className="text-lg leading-relaxed text-gray-700 mt-8 max-w-2xl mx-auto"
            variants={textFadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            Interact with our abstract car model to visualize the seamless experience we aim to provide. Rotate and zoom to see the details of our commitment to quality and innovation.
          </motion.p>
        </div>
      </section>
    </motion.section>
  );
}
