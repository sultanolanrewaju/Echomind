import feelings from "../tools/feelings";

interface PropsState {
  setOpenFeeling: (isFeeling: boolean) => void;
  setFeeling: (feeling: string) => void;
  selectedFeeling: string;
}
const FeelingModal = ({
  setOpenFeeling,
  setFeeling,
  selectedFeeling,
}: PropsState) => {
  return (
    <div className="feeling-modal">
      <div className="modal-box">
        <p>Select your mood/feelings ?</p>
        <div className="feel-container">
          {feelings.map((feel, idx) => {
            const tempFeel = `${feel.feeling} ${feel.emoji}`;
            return (
              <span
                onClick={() => {
                  setFeeling(tempFeel);
                  setOpenFeeling(false);
                }}
                key={idx}
                className={`feel ${tempFeel === selectedFeeling ? "active" : ""}`}
              >
                {feel.feeling} {feel.emoji}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeelingModal;
