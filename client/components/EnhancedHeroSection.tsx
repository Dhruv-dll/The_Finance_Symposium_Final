import { useRef, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Text3D, OrbitControls, Sphere, Box } from "@react-three/drei";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import * as THREE from "three";
import {
  finnhubMarketDataService,
  FinnhubStockData,
  MarketSentiment,
  safeFormatTimestamp,
} from "../services/finnhubMarketData";
import FloatingMarketIcon from "./FloatingMarketIcon";

// Enhanced Particle System with Financial Symbols
function FinancialParticles() {
  const particlesRef = useRef<THREE.Group>(null);
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      symbol: string;
      position: [number, number, number];
      velocity: [number, number, number];
      rotation: number;
      scale: number;
    }>
  >([]);

  const symbols = ["₹", "$", "€", "£", "¥", "📈", "📊", "💰", "💎", "⚡"];

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      position: [
        (Math.random() - 0.5) * 20,
        Math.random() * -10 - 5,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      velocity: [
        (Math.random() - 0.5) * 0.02,
        Math.random() * 0.01 + 0.005,
        (Math.random() - 0.5) * 0.02,
      ] as [number, number, number],
      rotation: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.5 + 0.5,
    }));
    setParticles(newParticles);
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((child, index) => {
        if (particles[index]) {
          const particle = particles[index];
          child.position.y += particle.velocity[1];
          child.position.x += particle.velocity[0];
          child.position.z += particle.velocity[2];
          child.rotation.z += 0.01;

          // Reset particle when it goes too high
          if (child.position.y > 10) {
            child.position.y = -10;
            child.position.x = (Math.random() - 0.5) * 20;
            child.position.z = (Math.random() - 0.5) * 10;
          }
        }
      });
    }
  });

  return (
    <group ref={particlesRef}>
      {particles.map((particle) => (
        <Float
          key={particle.id}
          speed={0.5}
          rotationIntensity={0.5}
          floatIntensity={0.2}
        >
          <mesh position={particle.position} scale={particle.scale}>
            <planeGeometry args={[0.5, 0.5]} />
            <meshBasicMaterial
              color="#FFD700"
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Floating Geometric Shapes
function FloatingGeometry() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.children.forEach((child, index) => {
        child.rotation.x = state.clock.elapsedTime * (0.2 + index * 0.1);
        child.rotation.z = state.clock.elapsedTime * (0.15 + index * 0.05);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Golden Wireframe Cubes */}
      <Float
        speed={1}
        rotationIntensity={0.5}
        floatIntensity={0.8}
        position={[-4, 2, -2]}
      >
        <Box args={[1, 1, 1]}>
          <meshBasicMaterial
            color="#FFD700"
            wireframe
            transparent
            opacity={0.6}
          />
        </Box>
      </Float>

      {/* Electric Blue Spheres */}
      <Float
        speed={1.5}
        rotationIntensity={0.8}
        floatIntensity={1.2}
        position={[4, -1, -3]}
      >
        <Sphere args={[0.8, 16, 16]}>
          <meshBasicMaterial
            color="#00FFFF"
            wireframe
            transparent
            opacity={0.4}
          />
        </Sphere>
      </Float>

      {/* Green Octahedrons */}
      <Float
        speed={0.8}
        rotationIntensity={0.3}
        floatIntensity={0.6}
        position={[2, 3, 1]}
      >
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color="#00FF00"
          wireframe
          transparent
          opacity={0.5}
        />
      </Float>

      {/* Gold Torus */}
      <Float
        speed={1.2}
        rotationIntensity={0.6}
        floatIntensity={0.9}
        position={[-3, -2, 2]}
      >
        <torusGeometry args={[1, 0.3, 8, 16]} />
        <meshBasicMaterial
          color="#FFD700"
          wireframe
          transparent
          opacity={0.7}
        />
      </Float>
    </group>
  );
}

// Enhanced Market Ticker with Accurate Real-Time Data
function EnhancedMarketTicker() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stockData, setStockData] = useState<FinnhubStockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment>({
    sentiment: "neutral",
    advanceDeclineRatio: 0.5,
    positiveStocks: 0,
    totalStocks: 0,
  });
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "reconnecting"
  >("connected");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Subscribe to Yahoo Finance real-time market updates
    setConnectionStatus("reconnecting");
    const unsubscribe = finnhubMarketDataService.subscribeToUpdates((data) => {
      setStockData(data.stocks);
      setMarketSentiment(data.sentiment);
      setLastUpdate(new Date());
      setIsLoading(false);
      setConnectionStatus("connected");
    });

    return unsubscribe;
  }, []);

  const isMarketOpen = () => {
    return finnhubMarketDataService.isMarketOpen();
  };

  const getSentimentColor = () => {
    switch (marketSentiment.sentiment) {
      case "bullish":
        return "from-finance-green/20 to-finance-green/5";
      case "bearish":
        return "from-finance-red/20 to-finance-red/5";
      default:
        return "from-finance-electric/20 to-finance-electric/5";
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "text-finance-green";
      case "disconnected":
        return "text-finance-red";
      case "reconnecting":
        return "text-finance-gold";
    }
  };

  const formatPrice = (symbol: string, price: number) => {
    if (symbol.includes("^")) {
      // Index symbols
      return price.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 2 }}
      className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r ${getSentimentColor()} backdrop-blur-md border-t border-finance-gold/20 overflow-hidden`}
    >
      {/* Market sentiment glow effect */}
      <div
        className={`absolute inset-0 ${
          marketSentiment.sentiment === "bullish"
            ? "shadow-[0_0_50px_rgba(0,255,0,0.1)]"
            : marketSentiment.sentiment === "bearish"
              ? "shadow-[0_0_50px_rgba(255,68,68,0.1)]"
              : "shadow-[0_0_50px_rgba(0,255,255,0.1)]"
        }`}
      ></div>

      <div className="container mx-auto px-6 py-4 relative">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${isMarketOpen() ? "bg-finance-green animate-pulse" : "bg-finance-red"} shadow-lg`}
              ></div>
              <span className="text-foreground font-medium">
                Market {isMarketOpen() ? "Open" : "Closed"}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  marketSentiment.sentiment === "bullish"
                    ? "bg-finance-green"
                    : marketSentiment.sentiment === "bearish"
                      ? "bg-finance-red"
                      : "bg-finance-electric"
                } animate-pulse`}
              ></div>
              <span className="text-finance-gold text-xs font-medium capitalize">
                {marketSentiment.sentiment} Sentiment (
                {marketSentiment.positiveStocks}/{marketSentiment.totalStocks})
              </span>
            </div>

            <div
              className={`flex items-center space-x-2 ${getConnectionStatusColor()}`}
            >
              <div
                className={`w-1 h-1 rounded-full ${getConnectionStatusColor().replace("text-", "bg-")} animate-pulse`}
              ></div>
              <span className="text-xs capitalize">{connectionStatus}</span>
            </div>

            <div className="text-finance-electric text-xs">
              {currentTime.toLocaleTimeString("en-IN")} IST
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 bg-finance-electric rounded-full animate-pulse"></div>
              <span className="text-finance-electric">📈 Yahoo Finance Live</span>
            </div>

            {isLoading && (
              <div className="flex items-center space-x-2 text-finance-gold text-xs">
                <div className="w-1 h-1 bg-finance-gold rounded-full animate-bounce"></div>
                <div
                  className="w-1 h-1 bg-finance-gold rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-1 h-1 bg-finance-gold rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <span className="ml-2">Generating data...</span>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Updated: {lastUpdate.toLocaleTimeString("en-IN")}
            </div>
          </div>

          <div className="flex-1 overflow-hidden ml-8">
            <div className="flex space-x-8 animate-scroll">
              {stockData.map((stock, index) => (
                <motion.div
                  key={`${stock.symbol}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 whitespace-nowrap relative group"
                >
                  <span className="font-bold text-finance-gold text-shadow-lg group-hover:text-finance-electric transition-colors duration-300">
                    {stock.name}
                  </span>
                  <span className="text-foreground font-medium">
                    {formatPrice(stock.symbol, stock.price)}
                  </span>
                  <span
                    className={`flex items-center space-x-1 font-medium ${
                      stock.change > 0
                        ? "text-finance-green"
                        : stock.change < 0
                          ? "text-finance-red"
                          : "text-finance-electric"
                    } text-shadow-sm`}
                  >
                    <span className="text-xs">
                      {stock.change > 0 ? "▲" : stock.change < 0 ? "▼" : "●"}
                    </span>
                    <span>{Math.abs(stock.change).toFixed(2)}</span>
                    <span className="text-xs">
                      ({stock.changePercent > 0 ? "+" : ""}
                      {stock.changePercent.toFixed(2)}%)
                    </span>
                  </span>

                  {/* Volume indicator for stocks */}
                  {stock.volume && stock.volume > 0 && (
                    <span className="text-xs text-muted-foreground">
                      Vol: {(stock.volume / 1000000).toFixed(1)}M
                    </span>
                  )}

                  {/* High volatility indicator */}
                  {Math.abs(stock.changePercent) > 3 && (
                    <motion.div
                      className={`w-2 h-2 rounded-full ${
                        stock.change > 0 ? "bg-finance-green" : "bg-finance-red"
                      } shadow-lg`}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  {/* Market state indicator */}
                  {stock.marketState && stock.marketState !== "REGULAR" && (
                    <span className="text-xs text-finance-electric bg-finance-electric/20 px-2 py-1 rounded">
                      {stock.marketState}
                    </span>
                  )}

                  {/* Enhanced hover tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-finance-navy-light/90 backdrop-blur-sm border border-finance-gold/20 rounded-lg p-3 text-xs whitespace-nowrap">
                      <div className="font-medium text-finance-gold">
                        {stock.name}
                      </div>
                      <div className="text-foreground">
                        Price: {formatPrice(stock.symbol, stock.price)}
                      </div>
                      {stock.dayHigh && stock.dayLow && (
                        <div className="text-muted-foreground">
                          Range: {formatPrice(stock.symbol, stock.dayLow)} -{" "}
                          {formatPrice(stock.symbol, stock.dayHigh)}
                        </div>
                      )}
                      <div className="text-xs text-finance-electric">
                        Updated: {safeFormatTimestamp(stock.timestamp)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Duplicate for continuous scroll */}
              {stockData.map((stock, index) => (
                <motion.div
                  key={`${stock.symbol}-dup-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (index + stockData.length) * 0.1 }}
                  className="flex items-center space-x-3 whitespace-nowrap"
                >
                  <span className="font-bold text-finance-gold text-shadow-lg">
                    {stock.name}
                  </span>
                  <span className="text-foreground font-medium">
                    {formatPrice(stock.symbol, stock.price)}
                  </span>
                  <span
                    className={`flex items-center space-x-1 font-medium ${
                      stock.change > 0
                        ? "text-finance-green"
                        : stock.change < 0
                          ? "text-finance-red"
                          : "text-finance-electric"
                    } text-shadow-sm`}
                  >
                    <span className="text-xs">
                      {stock.change > 0 ? "▲" : stock.change < 0 ? "▼" : "●"}
                    </span>
                    <span>{Math.abs(stock.change).toFixed(2)}</span>
                    <span className="text-xs">
                      ({stock.changePercent > 0 ? "+" : ""}
                      {stock.changePercent.toFixed(2)}%)
                    </span>
                  </span>

                  {Math.abs(stock.changePercent) > 3 && (
                    <div
                      className={`w-1 h-1 rounded-full animate-pulse ${
                        stock.change > 0 ? "bg-finance-green" : "bg-finance-red"
                      } shadow-lg`}
                    ></div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Mouse Cursor Trail Effect (Desktop only)
function CursorTrail() {
  const [trails, setTrails] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile/touch device
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isTouchDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Only add mouse tracking on non-mobile devices
    if (!isMobile) {
      let trailId = 0;

      const handleMouseMove = (e: MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });

        setTrails((prev) => [
          ...prev.slice(-10), // Keep only last 10 trails
          { x: e.clientX, y: e.clientY, id: trailId++ },
        ]);
      };

      window.addEventListener("mousemove", handleMouseMove);

      // Clean up old trails
      const cleanup = setInterval(() => {
        setTrails((prev) => prev.slice(-8));
      }, 100);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener('resize', checkMobile);
        clearInterval(cleanup);
      };
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Main cursor glow */}
      <motion.div
        className="absolute w-4 h-4 bg-finance-gold rounded-full mix-blend-difference opacity-80"
        style={{
          left: mousePos.x - 8,
          top: mousePos.y - 8,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Trail particles */}
      {trails.map((trail, index) => (
        <motion.div
          key={trail.id}
          className="absolute w-2 h-2 bg-finance-electric rounded-full"
          style={{
            left: trail.x - 4,
            top: trail.y - 4,
          }}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      ))}

      {/* Financial symbols that follow cursor */}
      <motion.div
        className="absolute text-finance-gold text-lg pointer-events-none"
        style={{
          left: mousePos.x + 20,
          top: mousePos.y - 20,
        }}
        animate={{
          rotate: [0, 360],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        ₹
      </motion.div>
    </div>
  );
}

export default function EnhancedHeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();

  // Color temperature transformation
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [
      "linear-gradient(135deg, #000012 0%, #001122 50%, #002244 100%)", // Cool blue morning
      "linear-gradient(135deg, #001122 0%, #112233 50%, #223344 100%)", // Warmer
      "linear-gradient(135deg, #221100 0%, #332211 50%, #443322 100%)", // Golden transition
      "linear-gradient(135deg, #332200 0%, #443311 50%, #554422 100%)", // Warm gold evening
    ],
  );

  const textGlow = useTransform(
    scrollYProgress,
    [0, 1],
    [
      "0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.3)",
      "0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.5)",
    ],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.section
      className="relative h-screen w-full overflow-hidden"
      style={{ background: backgroundColor }}
    >
      {/* Cursor Trail Effect */}
      <CursorTrail />

      {/* WebGL 3D Background */}
      <div className="absolute inset-0 opacity-60">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 60 }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#FFD700" />
          <pointLight
            position={[-10, -10, 10]}
            intensity={0.5}
            color="#00FFFF"
          />

          <FinancialParticles />
          <FloatingGeometry />
        </Canvas>
      </div>

      {/* Gradient Overlays with Parallax */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,215,0,0.2) 0%, transparent 70%)",
          transform: useTransform(
            scrollYProgress,
            [0, 1],
            ["translateY(0%)", "translateY(-50%)"],
          ),
        }}
      />

      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, rgba(0,255,255,0.3) 0%, transparent 50%)",
          transform: useTransform(
            scrollYProgress,
            [0, 1],
            ["translateY(0%)", "translateY(-30%)"],
          ),
        }}
      />

      {/* Hero Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="text-center px-6 max-w-5xl mx-auto">
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.span
              className="block bg-gradient-to-r from-finance-electric via-finance-gold to-finance-electric bg-clip-text text-transparent"
              style={{ textShadow: textGlow }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              The Finance
            </motion.span>
            <motion.span
              className="block bg-gradient-to-r from-finance-gold via-finance-electric to-finance-gold bg-clip-text text-transparent mt-4"
              style={{ textShadow: textGlow }}
              animate={{
                backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              Symposium
            </motion.span>
          </motion.h1>

          <motion.div
            className="relative mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-finance-gold/20 to-finance-electric/20 blur-3xl rounded-full"></div>
            <p className="relative text-xl md:text-2xl text-foreground/90 font-medium mb-2">
              Bridging Present & Future of Finance
            </p>
            <p className="relative text-lg md:text-xl text-finance-gold">
              St. Xavier's College Mumbai
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <motion.button
              className="px-10 py-4 bg-gradient-to-r from-finance-gold to-finance-electric text-finance-navy font-bold rounded-xl relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Explore Events</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-finance-electric to-finance-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255,215,0,0.5)",
                    "0 0 40px rgba(255,215,0,0.8)",
                    "0 0 20px rgba(255,215,0,0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>

            {/* Floating Market Dashboard Icon - now positioned as fixed element */}
            <FloatingMarketIcon />

            <motion.button
              className="px-10 py-4 border-2 border-finance-gold text-finance-gold rounded-xl hover:bg-finance-gold hover:text-finance-navy transition-all duration-500 relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Join Community</span>
              <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-finance-gold/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </motion.button>
          </motion.div>

          {/* Enhanced floating financial symbols */}
          <div className="absolute inset-0 pointer-events-none">
            {["₹", "$", "€", "📈", "���", "📊"].map((symbol, index) => (
              <motion.div
                key={symbol}
                className={`absolute text-3xl ${
                  index % 3 === 0
                    ? "text-finance-gold"
                    : index % 3 === 1
                      ? "text-finance-electric"
                      : "text-finance-green"
                } opacity-40`}
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + (index % 3) * 20}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 180, 360],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: 6 + index,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.5,
                }}
              >
                {symbol}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Market Ticker */}
      <EnhancedMarketTicker />

      {/* Light transition effect for scroll */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: useTransform(
            scrollYProgress,
            [0, 0.2, 0.8, 1],
            [
              "radial-gradient(circle at 50% 50%, rgba(0,255,255,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(0,255,255,0.05) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(255,215,0,0.05) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(255,215,0,0.1) 0%, transparent 50%)",
            ],
          ),
        }}
      />
    </motion.section>
  );
}
