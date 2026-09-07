import { useEffect, useRef, useState } from "react";
import type { CityPack } from "../cities/types";
import type { Direction, Movement } from "../game/engine";
import type { Weather } from "../game/weather";
import { SceneView } from "./render";
import { useTheme } from "../theme";
import { swipeDirection } from "../game/boardRotation";
export function BoardCanvas({
  city,
  board,
  events,
  reduced,
  labels,
  weather,
  rotationStep = 0,
  onMove,
  onSelect,
  fallback,
  label,
}: {
  city: CityPack;
  board: number[];
  events: Movement[];
  reduced: boolean;
  labels: boolean;
  weather: Weather;
  rotationStep?: number;
  onMove: (d: Direction) => void;
  onSelect?: (value: number) => void;
  fallback: string;
  label: string;
}) {
  const { resolved: theme } = useTheme();
  const ref = useRef<HTMLCanvasElement>(null),
    view = useRef<SceneView | null>(null),
    start = useRef<{
      x: number;
      y: number;
      pointerId: number;
      rotationStep: number;
    } | null>(null),
    mounted = useRef(false),
    lastTheme = useRef(theme);
  const [error, setError] = useState(false);
  useEffect(() => {
    try {
      view.current = new SceneView(
        ref.current!,
        "board",
        true,
        theme,
        rotationStep,
      );
    } catch {
      setError(true);
    }
    return () => {
      view.current?.dispose();
      view.current = null;
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    start.current = null;
    view.current?.setBoardRotation(rotationStep);
  }, [rotationStep]);
  useEffect(() => {
    // A fresh mount already draws the settled board, so the pending events of
    // the last move must not be replayed: leaving the board (atlas tab, page
    // change) and coming back would otherwise look like another move.
    const themeChanged = mounted.current && lastTheme.current !== theme;
    view.current?.board(
      city,
      board,
      mounted.current && !themeChanged ? events : [],
      reduced,
      labels,
      weather,
      theme,
    );
    mounted.current = true;
    lastTheme.current = theme;
  }, [city, board, events, reduced, labels, weather, theme]);
  return (
    <div
      className="board-canvas"
      role="group"
      aria-label={label}
      data-rotation-step={rotationStep}
    >
      <canvas
        ref={ref}
        aria-hidden="true"
        onPointerDown={(e) => {
          if (e.button !== 0 || !e.isPrimary || start.current) return;
          start.current = {
            x: e.clientX,
            y: e.clientY,
            pointerId: e.pointerId,
            rotationStep,
          };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerCancel={(e) => {
          if (start.current?.pointerId === e.pointerId) start.current = null;
        }}
        onLostPointerCapture={(e) => {
          if (start.current?.pointerId === e.pointerId) start.current = null;
        }}
        onPointerUp={(e) => {
          if (
            !start.current ||
            start.current.pointerId !== e.pointerId ||
            start.current.rotationStep !== rotationStep
          )
            return;
          const { x, y } = start.current;
          const dx = e.clientX - x,
            dy = e.clientY - y;
          start.current = null;
          // Too short to be a swipe: treat it as tapping the building itself
          // and open its atlas card.
          if (Math.hypot(dx, dy) < 25) {
            const index = view.current?.pick(e.clientX, e.clientY);
            if (index != null && board[index]) onSelect?.(board[index]);
            return;
          }
          const direction = view.current
            ? view.current.swipe(x, y, e.clientX, e.clientY)
            : swipeDirection(dx, dy, rotationStep);
          if (direction) onMove(direction);
        }}
      />
      {error && (
        <p className="webgl-error" role="alert">
          {fallback}
        </p>
      )}
    </div>
  );
}
export function ModelCanvas({
  city,
  value,
  fallback,
  label,
}: {
  city: CityPack;
  value: number;
  fallback: string;
  label: string;
}) {
  const { resolved: theme } = useTheme();
  const ref = useRef<HTMLCanvasElement>(null),
    view = useRef<SceneView | null>(null),
    drag = useRef<number | null>(null),
    angle = useRef(0);
  const [error, setError] = useState(false);
  useEffect(() => {
    try {
      view.current = new SceneView(ref.current!, "model", true, theme);
      view.current.model(city, value, angle.current, theme);
    } catch {
      setError(true);
    }
    return () => view.current?.dispose();
  }, [city, value]);
  useEffect(() => {
    view.current?.model(city, value, angle.current, theme);
  }, [city, value, theme]);
  return (
    <div className="model-view">
      <canvas
        ref={ref}
        tabIndex={0}
        aria-label={label}
        onKeyDown={(e) => {
          if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
            e.preventDefault();
            e.stopPropagation();
            angle.current += e.key === "ArrowLeft" ? -0.2 : 0.2;
            view.current?.rotate(angle.current);
          }
        }}
        onPointerDown={(e) => {
          drag.current = e.clientX;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (drag.current === null) return;
          angle.current += (e.clientX - drag.current) * 0.015;
          drag.current = e.clientX;
          view.current?.rotate(angle.current);
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      />
      {error && <p>{fallback}</p>}
    </div>
  );
}
