import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Text3D, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { marketDataService, StockData } from "../services/marketData";

// 3D Floating Financial Elements
function FloatingElement({
  position,
  children,
}: {
  position: [number, number, number];
  children: React.ReactNode;
}) {
  return (
    <Float
      speed={1.5}
      rotationIntensity={1}
      floatIntensity={0.5}
      position={position}
    >
      {children}
    </Float>
  );
}

function CandlestickChart({
  position,
}: {
  position: [number, number, number];
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[0.2, 2, 0.2]} />
      <meshStandardMaterial
        color="#FFD700"
        emissive="#FFD700"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

function FinancialGraph({ position }: { position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const points = [];
  for (let i = 0; i < 10; i++) {
    points.push(new THREE.Vector3(i * 0.3 - 1.5, Math.sin(i * 0.5) * 0.5, 0));
  }

  const curve = new THREE.CatmullRomCurve3(points);

  return (
    <mesh ref={mesh} position={position}>
      <tubeGeometry args={[curve, 20, 0.02, 8, false]} />
      <meshStandardMaterial
        color="#00FFFF"
        emissive="#00FFFF"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function MarketParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 50;

  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

    // Random colors between gold, electric blue, and green
    const colorChoice = Math.random();
    if (colorChoice < 0.33) {
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.84;
      colors[i * 3 + 2] = 0; // Gold
    } else if (colorChoice < 0.66) {
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1; // Electric blue
    } else {
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 0; // Green
    }
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.1} vertexColors transparent opacity={0.8} />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#FFD700" />
      <pointLight position={[-10, -10, 10]} intensity={0.5} color="#00FFFF" />

      <MarketParticles />

      <FloatingElement position={[-3, 1, 0]}>
        <CandlestickChart position={[0, 0, 0]} />
      </FloatingElement>

      <FloatingElement position={[3, -1, 0]}>
        <FinancialGraph position={[0, 0, 0]} />
      </FloatingElement>

      <FloatingElement position={[0, 2, -2]}>
        <CandlestickChart position={[0, 0, 0]} />
      </FloatingElement>

      <FloatingElement position={[-2, -2, 1]}>
        <FinancialGraph position={[0, 0, 0]} />
      </FloatingElement>
    </>
  );
}

function MarketTicker() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Subscribe to real-time market updates
    const unsubscribe = marketDataService.subscribeToUpdates((data) => {
      setStockData(data);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const isMarketOpen = () => {
    const hour = currentTime.getHours();
    const day = currentTime.getDay();
    // Indian market hours: 9:15 AM to 3:30 PM, Monday to Friday
    return day >= 1 && day <= 5 && hour >= 9 && hour < 16;
  };

  const formatPrice = (symbol: string, price: number) => {
    if (symbol === "SENSEX" || symbol === "NIFTY") {
      return price.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-finance-green";
    if (change < 0) return "text-finance-red";
    return "text-finance-electric";
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return "▲";
    if (change < 0) return "▼";
    return "●";
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-finance-navy via-finance-navy-light to-finance-navy border-t border-finance-gold/20 overflow-hidden">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${isMarketOpen() ? "bg-finance-green animate-pulse" : "bg-finance-red"}`}
              ></div>
              <span className="text-muted-foreground">
                Market {isMarketOpen() ? "Open" : "Closed"}
              </span>
            </div>
            <div className="text-finance-electric text-xs">
              {currentTime.toLocaleTimeString("en-IN")} IST
            </div>
            {isLoading && (
              <div className="flex items-center space-x-1 text-finance-gold text-xs">
                <div className="w-1 h-1 bg-finance-gold rounded-full animate-bounce"></div>
                <div
                  className="w-1 h-1 bg-finance-gold rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-1 h-1 bg-finance-gold rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <span className="ml-2">Loading live data...</span>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-hidden ml-6">
            <div className="flex space-x-8 animate-scroll">
              {stockData.map((stock, index) => (
                <div
                  key={`${stock.symbol}-${index}`}
                  className="flex items-center space-x-3 whitespace-nowrap"
                >
                  <span className="font-bold text-finance-gold text-shadow-lg">
                    {stock.symbol}
                  </span>
                  <span className="text-foreground font-medium">
                    {formatPrice(stock.symbol, stock.price)}
                  </span>
                  <span
                    className={`flex items-center space-x-1 font-medium ${getChangeColor(stock.change)} text-shadow-sm`}
                  >
                    <span className="text-xs">
                      {getChangeIcon(stock.change)}
                    </span>
                    <span>{Math.abs(stock.change).toFixed(2)}</span>
                    <span className="text-xs">
                      ({stock.changePercent > 0 ? "+" : ""}
                      {stock.changePercent.toFixed(2)}%)
                    </span>
                  </span>
                  {/* Glow effect for significant changes */}
                  {Math.abs(stock.changePercent) > 2 && (
                    <div
                      className={`w-1 h-1 rounded-full animate-pulse ${stock.change > 0 ? "bg-finance-green" : "bg-finance-red"}`}
                    ></div>
                  )}
                </div>
              ))}
              {/* Duplicate for continuous scroll */}
              {stockData.map((stock, index) => (
                <div
                  key={`${stock.symbol}-dup-${index}`}
                  className="flex items-center space-x-3 whitespace-nowrap"
                >
                  <span className="font-bold text-finance-gold text-shadow-lg">
                    {stock.symbol}
                  </span>
                  <span className="text-foreground font-medium">
                    {formatPrice(stock.symbol, stock.price)}
                  </span>
                  <span
                    className={`flex items-center space-x-1 font-medium ${getChangeColor(stock.change)} text-shadow-sm`}
                  >
                    <span className="text-xs">
                      {getChangeIcon(stock.change)}
                    </span>
                    <span>{Math.abs(stock.change).toFixed(2)}</span>
                    <span className="text-xs">
                      ({stock.changePercent > 0 ? "+" : ""}
                      {stock.changePercent.toFixed(2)}%)
                    </span>
                  </span>
                  {Math.abs(stock.changePercent) > 2 && (
                    <div
                      className={`w-1 h-1 rounded-full animate-pulse ${stock.change > 0 ? "bg-finance-green" : "bg-finance-red"}`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gradient fade effects for smooth scrolling appearance */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-finance-navy to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-finance-navy to-transparent pointer-events-none"></div>
    </div>
  );
}

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-finance-navy via-finance-navy-light to-finance-navy">
      {/* WebGL Background */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: "transparent" }}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Interactive Cursor Effect */}
      <div
        className="fixed w-8 h-8 pointer-events-none z-10 mix-blend-difference"
        style={{
          left: mousePosition.x * 50 + window.innerWidth / 2,
          top: -mousePosition.y * 50 + window.innerHeight / 2,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="w-full h-full bg-finance-gold rounded-full animate-pulse opacity-60"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-finance-gold via-finance-electric to-finance-gold bg-clip-text text-transparent animate-glow text-glow">
              The Finance
            </span>
            <br />
            <span className="bg-gradient-to-r from-finance-electric via-finance-gold to-finance-electric bg-clip-text text-transparent animate-glow text-glow">
              Symposium
            </span>
          </h1>

          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-finance-gold to-finance-electric opacity-20 blur-2xl"></div>
            <p className="relative text-xl md:text-2xl text-foreground/90 font-medium">
              Bridging Present & Future of Finance
            </p>
            <p className="relative text-lg md:text-xl text-finance-gold mt-2">
              St. Xavier's College Mumbai
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
            <button className="px-8 py-4 bg-gradient-to-r from-finance-gold to-finance-electric text-finance-navy font-bold rounded-lg market-glow glow-effect transform hover:scale-105 transition-all duration-300">
              Explore Events
            </button>
            <a
              href="https://xaviers.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-finance-gold text-finance-gold rounded-lg hover:bg-finance-gold hover:text-finance-navy transition-all duration-300 glow-effect inline-block"
            >
              Visit College Website
            </a>
          </div>

          {/* Floating Financial Symbols */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 text-finance-gold text-4xl animate-float opacity-60">
              ₹
            </div>
            <div
              className="absolute top-1/3 right-1/4 text-finance-electric text-3xl animate-float opacity-50"
              style={{ animationDelay: "1s" }}
            >
              $
            </div>
            <div
              className="absolute bottom-1/3 left-1/3 text-finance-green text-3xl animate-float opacity-40"
              style={{ animationDelay: "2s" }}
            >
              €
            </div>
            <div
              className="absolute top-1/2 right-1/3 text-finance-gold text-5xl animate-float opacity-30"
              style={{ animationDelay: "0.5s" }}
            >
              📈
            </div>
          </div>
        </div>
      </div>

      {/* Market Ticker */}
      <MarketTicker />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-finance-navy/80 via-transparent to-finance-navy/40 pointer-events-none"></div>
    </section>
  );
}
