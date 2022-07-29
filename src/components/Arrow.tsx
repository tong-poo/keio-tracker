interface Props {
  hidden: boolean;
  direction: "desc" | "asc";
}

const Arrow = ({ hidden = false, direction = "desc" }: Props) =>
  hidden ? (
    <div></div>
  ) : (
    <svg width="10" height="10" viewBox="0 0 24 24" className={direction}>
      <path
        d="M0,6 12,18 24,6"
        strokeWidth="5"
        stroke="black"
        fillOpacity="0"
      />
    </svg>
  );

export default Arrow;
