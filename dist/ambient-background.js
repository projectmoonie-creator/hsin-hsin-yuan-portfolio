import { Renderer } from "./vendor/ogl/src/core/Renderer.js";
import { Program } from "./vendor/ogl/src/core/Program.js";
import { Mesh } from "./vendor/ogl/src/core/Mesh.js";
import { Triangle } from "./vendor/ogl/src/extras/Triangle.js";

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform float uBeamOpacity;
uniform float uOpacity;
uniform float uSpeed;
uniform vec3 uRayColor1;
uniform vec3 uRayColor2;
uniform vec3 uLineColor1;
uniform vec3 uLineColor2;

out vec4 fragColor;

const float PI = 3.14159265;

mat2 rotate2d(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

float rayStrength(vec2 source, vec2 direction, vec2 coord, float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - source;
  float angle = dot(normalize(sourceToCoord), direction);
  float shimmer = 0.48 + 0.16 * sin(angle * seedA + uTime * speed)
                + 0.24 * cos(-angle * seedB + uTime * speed * 0.42);
  float distanceFade = clamp((uResolution.x * 1.25 - length(sourceToCoord)) / max(uResolution.x, 1.0), 0.0, 1.0);
  return clamp(shimmer, 0.0, 1.0) * pow(distanceFade, 1.55);
}

float waveLine(vec2 uv, float offset, float phase, float weight) {
  float time = uTime * uSpeed;
  float y = sin(uv.x * 1.18 + offset + time * 0.08) * 0.15
          + sin(uv.x * 2.35 - phase + time * 0.05) * 0.055;
  float d = abs(uv.y - y);
  float line = 0.0045 / max(d, 0.004);
  float fade = smoothstep(-1.1, -0.1, uv.x) * (1.0 - smoothstep(0.6, 1.45, uv.x));
  return line * fade * weight;
}

void main() {
  vec2 pixel = gl_FragCoord.xy;
  vec2 uv = (2.0 * pixel - uResolution.xy) / max(uResolution.y, 1.0);
  uv.y *= -1.0;

  float focus = clamp(uBeamOpacity, 0.0, 1.0);
  float time = uTime * uSpeed;

  vec3 color = vec3(0.0);

  vec2 topSource = vec2(uResolution.x * 1.08, -uResolution.y * 0.18);
  vec2 topCoord = vec2(pixel.x, uResolution.y - pixel.y);
  float tilt = radians(-8.0 + focus * 6.0);
  vec2 rel = topCoord - topSource;
  topCoord = rotate2d(tilt) * rel + topSource;
  vec2 rayDirA = normalize(vec2(cos(0.78), sin(0.78)));
  vec2 rayDirB = normalize(vec2(cos(1.05), sin(1.05)));
  float raysA = rayStrength(topSource, rayDirA, topCoord, 31.2, 19.7, 0.36 + focus * 0.22);
  float raysB = rayStrength(topSource, rayDirB, topCoord, 23.1, 15.9, 0.12 + focus * 0.12);
  float sourceGlow = 0.55 / pow(max(length(pixel - vec2(uResolution.x * 1.04, uResolution.y * 1.08)) / max(uResolution.y, 1.0), 0.08), 1.34);
  color += (uRayColor1 * raysA * 0.58 + uRayColor2 * raysB * 0.72) * sourceGlow;

  vec2 lowerSource = vec2(-uResolution.x * 0.22, uResolution.y * 1.08);
  vec2 lowerCoord = vec2(pixel.x, uResolution.y - pixel.y);
  vec2 lowerRel = lowerCoord - lowerSource;
  lowerCoord = rotate2d(radians(10.0)) * lowerRel + lowerSource;
  vec2 lowerDir = normalize(vec2(cos(-0.8), sin(-0.8)));
  float lowerRay = rayStrength(lowerSource, lowerDir, lowerCoord, 25.4, 17.3, 0.18);
  float lowerGlow = 0.38 / pow(max(length(pixel - vec2(-uResolution.x * 0.1, -uResolution.y * 0.05)) / max(uResolution.y, 1.0), 0.1), 1.2);
  color += uLineColor1 * lowerRay * lowerGlow * 0.36;

  vec2 lineUv = uv;
  lineUv += vec2(sin(time * 0.05) * 0.08, cos(time * 0.04) * 0.04);
  lineUv = rotate2d(-0.19) * lineUv;

  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    float lane = -0.38 + fi * 0.12;
    float t = fi / 6.0;
    vec3 lineColor = mix(uLineColor1, uLineColor2, t);
    float line = waveLine(lineUv + vec2(fi * 0.065, lane), fi * 0.78, fi * 1.37, 0.028 + focus * 0.028);
    color += lineColor * line;
  }

  float vignette = smoothstep(1.6, 0.2, length(uv * vec2(0.92, 1.1)));
  float grain = fract(sin(dot(pixel + floor(uTime * 24.0), vec2(12.9898, 78.233))) * 43758.5453);
  color *= vignette;
  color += (grain - 0.5) * 0.012;

  float gray = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(gray), color, 0.92);
  color = 1.0 - exp(-color * (0.92 + focus * 0.72));

  float alpha = clamp(max(max(color.r, color.g), color.b), 0.0, 1.0) * uOpacity;
  fragColor = vec4(color * uOpacity, alpha);
}
`;

function hexToRgb(hex) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return [1, 1, 1];
  return [Number.parseInt(match[1], 16) / 255, Number.parseInt(match[2], 16) / 255, Number.parseInt(match[3], 16) / 255];
}

export function initAmbientBackground(container) {
  if (!container) return null;

  const renderer = new Renderer({
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    dpr: Math.min(window.devicePixelRatio || 1, 1.5),
    powerPreference: "low-power",
  });

  const gl = renderer.gl;
  if (!gl || !renderer.isWebgl2) return null;

  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.canvas.className = "ambient-canvas";
  gl.canvas.style.backgroundColor = "transparent";

  const geometry = new Triangle(gl);
  if (geometry.attributes.uv) delete geometry.attributes.uv;

  const program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: [container.offsetWidth, container.offsetHeight] },
      uBeamOpacity: { value: 0.55 },
      uOpacity: { value: 0.58 },
      uSpeed: { value: 0.76 },
      uRayColor1: { value: hexToRgb("#d8ff3e") },
      uRayColor2: { value: hexToRgb("#7cc7ff") },
      uLineColor1: { value: hexToRgb("#f7f2e8") },
      uLineColor2: { value: hexToRgb("#6bf0d8") },
    },
  });

  const mesh = new Mesh(gl, { geometry, program });
  container.prepend(gl.canvas);
  document.documentElement.classList.add("has-ambient-background");

  function resize() {
    const width = container.offsetWidth || window.innerWidth;
    const height = container.offsetHeight || window.innerHeight;
    renderer.setSize(width, height);
    program.uniforms.uResolution.value = [width * renderer.dpr, height * renderer.dpr];
  }

  let frame = 0;
  function render(time) {
    frame = window.requestAnimationFrame(render);
    const beamOpacity = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--beam-opacity")) || 0.6;
    program.uniforms.uTime.value = time * 0.001;
    program.uniforms.uBeamOpacity.value = beamOpacity;
    program.uniforms.uOpacity.value = 0.34 + beamOpacity * 0.22;
    renderer.render({ scene: mesh });
  }

  window.addEventListener("resize", resize);
  resize();
  frame = window.requestAnimationFrame(render);

  return {
    destroy() {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      gl.canvas.remove();
      document.documentElement.classList.remove("has-ambient-background");
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
