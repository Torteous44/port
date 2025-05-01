import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";

export interface HeroVisualHandle {
  updateMousePosition: (x: number, y: number) => void;
}

export const HeroVisual = forwardRef<HeroVisualHandle>((_, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.0 }); // Store smoothed mouse position
  const lastMouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.0 }); // For interpolation
  const isMouseOverRef = useRef<boolean>(false); // Track if mouse is over the canvas
  const actualMouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 }); // Track actual mouse position
  const mousePresenceRef = useRef<number>(0.0); // Mouse presence factor (0 = absent, 1 = present)
  const heroRef = useRef<HeroVisualHandle | null>(null);

  useImperativeHandle(ref, () => ({
    updateMousePosition: (x: number, y: number) => {
      if (!containerRef.current) return;

      if (x === 0.5 && y === 0.5) {
        isMouseOverRef.current = false;
        return;
      }

      // Simply normalize the coordinates to [0,1] range
      actualMouseRef.current.x = x;
      actualMouseRef.current.y = y;
      lastMouseRef.current.x = x;
      lastMouseRef.current.y = y;

      isMouseOverRef.current = true;
    },
  }));

  // Add direct mouse tracking for the container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (heroRef.current?.updateMousePosition) {
        heroRef.current.updateMousePosition(x, y);
      }
    };

    const handleMouseLeave = () => {
      if (heroRef.current?.updateMousePosition) {
        heroRef.current.updateMousePosition(0.5, 0.5);
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    // Dynamically import Three.js to prevent it from blocking initial render
    const setupVisual = async () => {
      try {
        // If container is gone, don't continue
        if (!containerRef.current) return;

        // Clear any previous content
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }

        // Create renderer
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
        });
        renderer.setSize(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        );
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
        renderer.setClearColor(0x000000, 0); // Set transparent background
        containerRef.current.appendChild(renderer.domElement);

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        camera.position.z = 1;

        // Create shader material
        const shaderMaterial = new THREE.ShaderMaterial({
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            varying vec2 vUv;
            uniform vec2 uResolution;
            uniform vec2 uMouse;
            uniform float uTime;
            uniform float uMousePresence;
            
            // Simple hash function for random values
            float hash(vec2 p) {
              p = fract(p * vec2(123.34, 456.21));
              p += dot(p, p + 42.32);
              return fract(p.x * p.y);
            }
            
            // Smoothed noise function
            float noise(vec2 p) {
              vec2 i = floor(p);
              vec2 f = fract(p);
              f = f * f * (950.0  * f); // Smooth interpolation
              
              float a = hash(i);
              float b = hash(i + vec2(1.0, 0.0));
              float c = hash(i + vec2(0.0, 1.0));
              float d = hash(i + vec2(1.0, 1.0));
              
              return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
            }
            
            // Pixelate coordinates to create blocky effect - but with smoother edges
            vec2 pixelate(vec2 uv, float pixelSize) {
              // Apply a slight dithering to soften the pixel edges
              uv += noise(uv * 1000.0) * 5.0;
              return floor(uv * pixelSize) / pixelSize;
            }
            
            // SDF for the abstract angle bracket shape '<'
            float sdfAngleBracket(vec2 uv) {
              // Center and scale UVs, maybe adjust aspect ratio slightly if needed
              vec2 st = (uv - 1.9) * vec2(1.8, 1.8); 
              
              // Vertical symmetry
              float ay = abs(st.y);
              
              // Define the sloping line for the bracket shape
              // Slope determines the angle, offset shifts it horizontally
              float slope = 0.1; // Adjust for angle sharpness
              float offset = 0.35; // Adjust horizontal position
              float lineX = ay * slope - offset;
              
              // Distance to the sloped line
              float d = st.x - lineX; // Use signed distance for one side
              
              // Define thickness
              float thickness = 29.0; // Adjust thickness
              d = abs(d) - thickness * 1.2; // Center thickness around the line
              
              // Vertical bounds (smoothly fade near top/bottom)
              float vertBound = 1.0;
              d = max(d, ay - vertBound); // Hard cut vertically
              
              
              return d;
            }
            
            // Smooth warp function
            vec2 warp(vec2 uv, vec2 mouse, float time, float mousePresence) {
              float dist = distance(uv, mouse);
              
              // Create a more concentrated falloff for the warping effect
              float influence = smoothstep(0.3, 0.01, dist); // Reduced range for more concentration
              
              // Ambient warping - subtle flowing waves using multiple sine waves
              float ambientWaveX = sin(uv.y * 3.0 + time * 0.3) * cos(uv.x * 2.5 - time * 1.2) * 0.005;
              float ambientWaveY = cos(uv.x * 2.7 + time * 0.4) * sin(uv.y * 3.5 + time * 1.3) * 0.005;
              vec2 ambientOffset = vec2(ambientWaveX, ambientWaveY);
              
              // Mouse-based warping
              // More intense but localized ripples
              float angle = atan(uv.y - mouse.y, uv.x - mouse.x);
              float waveIntensity = 15.0 + 0.1 * (sin(time)); // Increased intensity
              
              // Create a more concentrated radial wave
              float radialWave = sin(dist * 3.0 - time * 2.8) * waveIntensity;
              
              // Apply directional warping with increased local effect
              vec2 mouseOffset = vec2(
                cos(angle) * radialWave,
                sin(angle) * radialWave
              ) * 0.0002; // Increased scaling factor for more pronounced local effect
              
              // Apply mouse presence factor to gradually fade mouse effect
              return uv + mouseOffset * influence * mousePresence + ambientOffset;
            }
            
            void main() {
              vec2 uv = vUv;
              
              // Use smooth warping based on mouse position
              uv = warp(uv, uMouse, uTime * 0.05, uMousePresence); // Adjusted time factor
              
              // Pixelate the UV coordinates at a good resolution
              // but with different values for the main shape and the rest
              float pixelBase = 10.0;
              vec2 pix_uv = pixelate(uv, pixelBase);
              
              // Calculate shape with smooth border
              float shapeDist = sdfAngleBracket(pix_uv);
              float shape = smoothstep(0.02, -0.0002, shapeDist);
              
              vec3 bgColor = vec3(0.1155, 0.1155, 0.1155); 
              vec3 shapeColor = vec3(0.1155, 0.1155, 0.1155); // White
              
              // Final color is a mix based on the shape SDF with transparency
              vec3 color = mix(bgColor, shapeColor, shape);
              // Use shape as alpha channel - only show shape, background is transparent
              gl_FragColor = vec4(color, shape);
            }
          `,
          uniforms: {
            uTime: { value: 0.0 },
            uResolution: {
              value: new THREE.Vector2(
                containerRef.current.clientWidth * renderer.getPixelRatio(),
                containerRef.current.clientHeight * renderer.getPixelRatio()
              ),
            },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uMousePresence: { value: 0.0 },
          },
        });

        // Create mesh
        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, shaderMaterial);
        scene.add(mesh);

        // Cache the bounding rect to avoid layout thrashing
        let containerRect = containerRef.current.getBoundingClientRect();

        // Update cached bounds when resizing or scrolling
        const updateBounds = () => {
          if (!containerRef.current) return;
          containerRect = containerRef.current.getBoundingClientRect();
        };

        // Handle both pointer and touch events with a common function
        const updateMousePosition = (clientX: number, clientY: number) => {
          // Account for scrolling position to get correct coordinates
          const scrollX = window.scrollX || window.pageXOffset;
          const scrollY = window.scrollY || window.pageYOffset;

          // Calculate position relative to the element, accounting for scroll
          const elementX =
            clientX - containerRect.left - scrollX + window.scrollX;
          const elementY =
            clientY - containerRect.top - scrollY + window.scrollY;

          const normalizedX = elementX / containerRect.width;
          const normalizedY = 1.0 - elementY / containerRect.height;

          // Update actual mouse position always
          actualMouseRef.current.x = normalizedX;
          actualMouseRef.current.y = normalizedY;

          // Only update target position directly if mouse is over
          if (isMouseOverRef.current) {
            lastMouseRef.current.x = normalizedX;
            lastMouseRef.current.y = normalizedY;
          }
        };

        // Mouse tracking with improved event handlers
        const handlePointerMove = (event: PointerEvent) => {
          event.preventDefault();
          updateMousePosition(event.clientX, event.clientY);
        };

        // Touch event handling
        const handleTouchMove = (event: TouchEvent) => {
          event.preventDefault();
          if (event.touches.length > 0) {
            updateMousePosition(
              event.touches[0].clientX,
              event.touches[0].clientY
            );
          }
        };

        // Handle mouse entering the canvas
        const handlePointerEnter = (event: PointerEvent) => {
          isMouseOverRef.current = true;
          updateMousePosition(event.clientX, event.clientY);
        };

        // Handle mouse leaving the canvas - don't immediately reset
        const handlePointerLeave = () => {
          isMouseOverRef.current = false;
          // Keep the last mouse position when leaving - no reset
        };

        // Add scroll event listener to update bounds when scrolling
        window.addEventListener("scroll", updateBounds, { passive: true });

        // Add all event listeners
        containerRef.current.addEventListener(
          "pointermove",
          handlePointerMove,
          { passive: false }
        );
        containerRef.current.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        });
        containerRef.current.addEventListener(
          "pointerleave",
          handlePointerLeave
        );
        containerRef.current.addEventListener(
          "pointerenter",
          handlePointerEnter
        );

        // Handle resize
        const handleResize = () => {
          if (!containerRef.current) return;

          const width = containerRef.current.clientWidth;
          const height = containerRef.current.clientHeight;

          renderer.setSize(width, height);
          shaderMaterial.uniforms.uResolution.value.set(
            width * renderer.getPixelRatio(),
            height * renderer.getPixelRatio()
          );

          // Update the cached bounds
          updateBounds();
        };

        window.addEventListener("resize", handleResize);

        // Animation loop with improved mouse interpolation
        const animate = (time: number) => {
          if (!containerRef.current) return;

          // Smoothly transition mouse presence factor with faster fade out
          if (isMouseOverRef.current) {
            mousePresenceRef.current += (1.0 - mousePresenceRef.current) * 0.1; // Faster fade in
          } else {
            mousePresenceRef.current *= 0.85; // Faster fade out
          }

          // Update shader uniform for mouse presence
          shaderMaterial.uniforms.uMousePresence.value =
            mousePresenceRef.current;

          if (isMouseOverRef.current) {
            // When mouse is over canvas, smoothly transition to actual mouse position
            mouseRef.current.x +=
              (actualMouseRef.current.x - mouseRef.current.x) * 0.1;
            mouseRef.current.y +=
              (actualMouseRef.current.y - mouseRef.current.y) * 0.1;
          }

          shaderMaterial.uniforms.uTime.value = time * 0.001;
          shaderMaterial.uniforms.uMouse.value.set(
            mouseRef.current.x,
            mouseRef.current.y
          );

          renderer.render(scene, camera);
          animationRef.current = requestAnimationFrame(animate);
        };

        animate(0);

        // Cleanup function
        return () => {
          cancelAnimationFrame(animationRef.current as number);
          window.removeEventListener("resize", handleResize);
          window.removeEventListener("scroll", updateBounds);
          if (containerRef.current) {
            containerRef.current.removeEventListener(
              "pointermove",
              handlePointerMove
            );
            containerRef.current.removeEventListener(
              "touchmove",
              handleTouchMove
            );
            containerRef.current.removeEventListener(
              "pointerleave",
              handlePointerLeave
            );
            containerRef.current.removeEventListener(
              "pointerenter",
              handlePointerEnter
            );
          }
          renderer.dispose();
          geometry.dispose();
          shaderMaterial.dispose();
        };
      } catch (error) {
        console.error("Failed to initialize WebGL visual:", error);
        // Fallback to a simple div or image if needed
      }
    };

    setupVisual();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        transform: "scale(3)",
      }}
    />
  );
});
