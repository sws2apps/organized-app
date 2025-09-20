import useStandardDuties from './useStandardDuties';
import DutyItem from './duty_item';

const StandardDuties = () => {
  const { duties } = useStandardDuties();

  return (
    <>
      {duties.map((duty) => (
        <DutyItem key={duty} duty={duty} />
      ))}
    </>
  );
};

export default StandardDuties;
