<script lang="ts">
  let {
    imageUrl,
    stageWidth,
    stageHeight,
    width = 480,
    height = 300,
    displacementScale = 22,
    blur = 1.5,
    aberration = 0.02,
    edgeAberration = 0.02,
    edgeWidth = 2,
    edgeFeather = 10,
    turbulenceBaseX = 0.001,
    turbulenceBaseY = 0.001,
    turbulenceOctaves = 2,
    magnification = 1.5
  } = $props<{
    imageUrl: string;
    stageWidth: number;
    stageHeight: number;
    width?: number;
    height?: number;
    displacementScale?: number;
    blur?: number;
    aberration?: number;
    turbulenceBaseX?: number;
    turbulenceBaseY?: number;
    turbulenceOctaves?: number;
    magnification?: number;
    edgeAberration?: number;
    edgeWidth?: number;
    edgeFeather?: number;
  }>();

  // Draggable position
  let x = $state(40);
  let y = $state(40);

  let dragging = false;
  let pointerId: number | null = null;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  const uid = `disp-${Math.random().toString(36).slice(2)}`;

  function onPointerDown(event: PointerEvent) {
    event.preventDefault();
    dragging = true;
    pointerId = event.pointerId;
    (event.currentTarget as HTMLElement).setPointerCapture(pointerId);
    startX = event.clientX;
    startY = event.clientY;
    startLeft = x;
    startTop = y;
  }

  function onPointerMove(event: PointerEvent) {
    if (!dragging) return;
    x = startLeft + (event.clientX - startX);
    y = startTop + (event.clientY - startY);
  }

  function onPointerUp(event: PointerEvent) {
    if (!dragging) return;
    dragging = false;
    if (pointerId != null) (event.currentTarget as HTMLElement).releasePointerCapture(pointerId);
    pointerId = null;
  }

  // Compute alignment so the window shows the exact portion of the stage background.
  let imgWidth = $derived(stageWidth * magnification);
  let imgHeight = $derived(stageHeight * magnification);
  let imageX = $derived(-(x + width / 2) * magnification + width / 2);
  let imageY = $derived(-(y + height / 2) * magnification + height / 2);
</script>

<div
  class="window"
  style={`transform: translate(${x}px, ${y}px); width:${width}px; height:${height}px;`}
  onpointerdown={onPointerDown}
  onpointermove={onPointerMove}
  onpointerup={onPointerUp}
>
  <svg class="svg" {width} {height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
    <defs>
      <!-- Reusable rounded-rect shape -->
      <rect id={`${uid}-shape`} x="0" y="0" width={width} height={height} rx="16" ry="16" />
      <clipPath id={`${uid}-clip`}>
        <use href={`#${uid}-shape`} />
      </clipPath>

      <!-- Edge mask: a stroked rounded-rect with feather -->
      <filter id={`${uid}-edge-feather`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation={edgeFeather} />
      </filter>
      <mask id={`${uid}-edge-mask`} maskUnits="userSpaceOnUse">
        <!-- black background hides everything by default -->
        <rect x="0" y="0" width={width} height={height} fill="black" />
        <!-- white ring around the edges shows only that region -->
        <use href={`#${uid}-shape`} fill="none" stroke="white" stroke-width={edgeWidth * 2} filter={`url(#${uid}-edge-feather)`} />
      </mask>

      <!-- Base filter: displacement + blur + subtle aberration -->
      <filter id={`${uid}-filter-base`} x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
        <feTurbulence type="turbulence" baseFrequency={`${turbulenceBaseX} ${turbulenceBaseY}`} numOctaves={turbulenceOctaves} seed="3" stitchTiles="stitch" result="noise">
          <animate attributeName="baseFrequency" values={`${turbulenceBaseX} ${turbulenceBaseY}; ${turbulenceBaseX * 1.4} ${turbulenceBaseY * 1.4}; ${turbulenceBaseX} ${turbulenceBaseY}`} dur="16s" repeatCount="indefinite" />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale={displacementScale} xChannelSelector="R" yChannelSelector="G" result="disp" />
        <feGaussianBlur in="disp" stdDeviation={blur} result="soft" />
        <feColorMatrix in="soft" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r_b" />
        <feOffset in="r_b" dx={aberration} dy="0" result="r_b_off" />
        <feColorMatrix in="soft" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g_b" />
        <feOffset in="g_b" dx="0" dy="0" result="g_b_off" />
        <feColorMatrix in="soft" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b_b" />
        <feOffset in="b_b" dx={-aberration} dy="0" result="b_b_off" />
        <feBlend in="r_b_off" in2="g_b_off" mode="screen" result="rg_b" />
        <feBlend in="rg_b" in2="b_b_off" mode="screen" result="final_base" />
      </filter>

      <!-- Edge filter: displacement + blur + STRONG aberration -->
      <filter id={`${uid}-filter-edge`} x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
        <feTurbulence type="turbulence" baseFrequency={`${turbulenceBaseX} ${turbulenceBaseY}`} numOctaves={turbulenceOctaves} seed="4" stitchTiles="stitch" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale={displacementScale} xChannelSelector="R" yChannelSelector="G" result="disp" />
        <feGaussianBlur in="disp" stdDeviation={blur} result="soft" />
        <feOffset in="soft" dx={edgeAberration} dy="0" result="soft_r" />
        <feColorMatrix in="soft_r" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r_e" />
        <feOffset in="soft" dx={-edgeAberration} dy="0" result="soft_b" />
        <feColorMatrix in="soft_b" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b_e" />
        <feBlend in="r_e" in2="b_e" mode="screen" result="final_edge" />
      </filter>
    </defs>

    <!-- Base layer -->
    <g clip-path={`url(#${uid}-clip)`} filter={`url(#${uid}-filter-base)`}>
      <image href={imageUrl} x={imageX} y={imageY} width={imgWidth} height={imgHeight} preserveAspectRatio="xMidYMid slice" />
    </g>

    <!-- Edge-only strong aberration layer -->
    <g clip-path={`url(#${uid}-clip)`} mask={`url(#${uid}-edge-mask)`} filter={`url(#${uid}-filter-edge)`}>
      <image href={imageUrl} x={imageX} y={imageY} width={imgWidth} height={imgHeight} preserveAspectRatio="xMidYMid slice" />
    </g>

    <!-- Subtle border -->
    <rect x="0" y="0" width={width} height={height} rx="16" ry="16" class="frame" />
  </svg>
</div>

<style>
  .window {
    position: absolute;
    left: 0;
    top: 0;
    cursor: grab;
    user-select: none;
    touch-action: none;
    /* Depth */
    filter: drop-shadow(0 8px 24px rgba(0,0,0,0.35));
    will-change: transform;
  }
  .window:active { cursor: grabbing; }

  .svg { display: block; }

  .frame {
    fill: rgba(255,255,255,0.03);
    stroke: rgba(255,255,255,0.25);
    stroke-width: 1;
  }
</style>


