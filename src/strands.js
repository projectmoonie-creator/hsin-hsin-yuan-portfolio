import { Renderer } from "./vendor/ogl/src/core/Renderer.js";
import { Program } from "./vendor/ogl/src/core/Program.js";
import { Mesh } from "./vendor/ogl/src/core/Mesh.js";
import { Color } from "./vendor/ogl/src/math/Color.js";
import { Triangle } from "./vendor/ogl/src/extras/Triangle.js";

const MAX_STRANDS = 8;
const MAX_COLORS = 6;

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
uniform vec3 uColors[${MAX_COLORS}];
uniform int uColorCount;
uniform int uStrandCount;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaviness;
uniform float uThickness;
uniform float uGlow;
uniform float uTaper;
uniform float uSpread;
uniform float uHueShift;
uniform float uIntensity;
uniform float uOpacity;
uniform float uScale;
uniform float uSaturation;

out vec4 fragColor;

const float PI = 3.14159265;

vec3 spectrum(float t) {
  return 0.5 + 0.5 * cos(2.0 * PI * (t + vec3(0.00, 0.33, 0.67)));
}

vec3 samplePalette(float t) {
  t = fract(t);
  float scaled = t * float(uColorCount);
  int idx = int(floor(scaled));
  float blend = fract(scaled);
  int nextIdx = idx + 1;
  if (nextIdx >= uColorCount) nextIdx = 0;
  return mix(uColors[idx], uColors[nextIdx], blend);
}

vec3 strandColor(float t) {
  if (uColorCount > 0) return samplePalette(t);
  return spectrum(t);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  uv /= max(uScale, 0.0001);

  float e = 0.06 + uIntensity * 0.94;
  float env = pow(max(cos(uv.x * PI * 1.3), 0.0), uTaper);

  vec3 col = vec3(0.0);

  for (int i = 0; i < ${MAX_STRANDS}; i++) {
    if (i >= uStrandCount) break;

    float fi = float(i);
    float ph = fi * 1.7 * uSpread;
    float freq = (2.0 + fi * 0.35) * uWaviness;
    float spd = 1.4 + fi * 1.2;

    float tt = uTime * uSpeed;
    float w = sin(uv.x * freq + tt * spd + ph) * 0.60
            + sin(uv.x * freq * 1.1 - tt * spd * 0.7 + ph * 1.7) * 0.40;

    float amp = (0.1 + 0.02 * e) * env * uAmplitude;
    float y = w * amp;

    float d = abs(uv.y - y);
    float thick = (0.001 + 0.05 * e) * (0.35 + env) * uThickness;
    float g = thick / (d + thick * 0.45);
    g = g * g;

    float h = fi / float(uStrandCount) + uv.x * 0.30 + uTime * 0.04 + uHueShift;
    col += strandColor(h) * g * env;
  }

  col *= 0.45 + 0.7 * e;
  col = 1.0 - exp(-col * uGlow);

  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = max(mix(vec3(gray), col, uSaturation), 0.0);

  float lum = max(max(col.r, col.g), col.b);
  float alpha = clamp(lum, 0.0, 1.0) * uOpacity;

  fragColor = vec4(col * uOpacity, alpha);
}
`;

function buildPalette(colors) {
  const filled = colors?.length ? colors : ["#ffffff"];
  const padded = [];
  for (let i = 0; i < MAX_COLORS; i += 1) {
    const c = new Color(filled[i] ?? filled[filled.length - 1]);
    padded.push([c.r, c.g, c.b]);
  }
  return padded;
}

export function initStrandsLayer(container) {
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
  gl.canvas.className = "strands-canvas";
  gl.canvas.style.backgroundColor = "transparent";

  const geometry = new Triangle(gl);
  if (geometry.attributes.uv) delete geometry.attributes.uv;

  const colors = ["#d8ff3e", "#7cc7ff", "#f7f2e8", "#6bf0d8"];
  const program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: [container.offsetWidth, container.offsetHeight] },
      uColors: { value: buildPalette(colors) },
      uColorCount: { value: colors.length },
      uStrandCount: { value: 4 },
      uSpeed: { value: 0.18 },
      uAmplitude: { value: 0.75 },
      uWaviness: { value: 1.12 },
      uThickness: { value: 0.46 },
      uGlow: { value: 2.0 },
      uTaper: { value: 2.65 },
      uSpread: { value: 0.92 },
      uHueShift: { value: 0 },
      uIntensity: { value: 0.46 },
      uOpacity: { value: 0.52 },
      uScale: { value: 1.34 },
      uSaturation: { value: 0.88 },
    },
  });

  const mesh = new Mesh(gl, { geometry, program });
  container.prepend(gl.canvas);
  document.documentElement.classList.add("has-strands");

  function resize() {
    const width = container.offsetWidth || window.innerWidth;
    const height = container.offsetHeight || window.innerHeight;
    renderer.setSize(width, height);
    program.uniforms.uResolution.value = [width, height];
  }

  let frame = 0;
  function render(time) {
    frame = window.requestAnimationFrame(render);
    const beamOpacity = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--beam-opacity")) || 0.6;
    program.uniforms.uTime.value = time * 0.001;
    program.uniforms.uIntensity.value = 0.34 + beamOpacity * 0.22;
    program.uniforms.uOpacity.value = 0.34 + beamOpacity * 0.24;
    program.uniforms.uHueShift.value = beamOpacity * 0.04;
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
      document.documentElement.classList.remove("has-strands");
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
