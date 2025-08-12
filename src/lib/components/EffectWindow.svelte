<script lang="ts">
  let {
    imageUrl,
    stageWidth,
    stageHeight,
    width = 480,
    height = 300,
    displacementScale = 22,
    blur = 1.5,
    aberration = 1.6,
    turbulenceBaseX = 0.008,
    turbulenceBaseY = 0.013,
    turbulenceOctaves = 2,
    magnification = 1.1,
    animateNoise = false
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
    animateNoise?: boolean;
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
      <clipPath id={`${uid}-clip`}>
        <rect x="0" y="0" width={width} height={height} rx="16" ry="16" />
      </clipPath>

      <filter id={`${uid}-filter`} x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
        <feTurbulence
          type="turbulence"
          baseFrequency={`${turbulenceBaseX} ${turbulenceBaseY}`}
          numOctaves={turbulenceOctaves}
          seed="3"
          stitchTiles="stitch"
          result="noise"
        >
          {#if animateNoise}
            <animate attributeName="baseFrequency" values={`${turbulenceBaseX} ${turbulenceBaseY}; ${turbulenceBaseX * 1.4} ${turbulenceBaseY * 1.4}; ${turbulenceBaseX} ${turbulenceBaseY}`} dur="16s" repeatCount="indefinite" />
          {/if}
        </feTurbulence>

        <!-- Displace based on noise -->
        <feDisplacementMap in="SourceGraphic" in2="noise" scale={displacementScale} xChannelSelector="R" yChannelSelector="G" result="disp" />

        <!-- Optional blur for softness/depth -->
        <feGaussianBlur in="disp" stdDeviation={blur} result="soft" />

        <!-- Chromatic aberration: split channels and offset -->
        <feColorMatrix in="soft" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
        <feOffset in="r" dx={aberration} dy="0" result="r2" />

        <feColorMatrix in="soft" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
        <feOffset in="g" dx="0" dy="0" result="g2" />

        <feColorMatrix in="soft" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
        <feOffset in="b" dx={-aberration} dy="0" result="b2" />

        <feBlend in="r2" in2="g2" mode="screen" result="rg" />
        <feBlend in="rg" in2="b2" mode="screen" result="final" />

        <feComposite in="final" in2="final" operator="over" />
      </filter>
    </defs>

    <g clip-path={`url(#${uid}-clip)`} filter={`url(#${uid}-filter)`}>
      <image
        href={imageUrl}
        x={imageX}
        y={imageY}
        width={imgWidth}
        height={imgHeight}
        preserveAspectRatio="xMidYMid slice"
      />
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


