export default function WheelSvg({
  className = undefined,
}: {
  className: string | undefined;
}) {
  return (
    <svg
      className={className}
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 22C2 10.9543 10.9543 2 22 2V2C33.0457 2 42 10.9543 42 22V22C42 33.0457 33.0457 42 22 42V42C10.9543 42 2 33.0457 2 22V22Z"
        stroke="#745656"
        stroke-width="2"
        stroke-linecap="square"
        stroke-linejoin="round"
        stroke-dasharray="8 8"
      />
    </svg>
  );
}
