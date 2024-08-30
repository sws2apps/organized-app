import Dialog from '@components/dialog';
import { InitialSetupModalWindowProps } from './initial_setup_modal_window.types';

const InitialSetupModalWindow = (props: InitialSetupModalWindowProps) => {
  return (
    <Dialog open={props.isOpen} onClose={null}>
      <h1></h1>
    </Dialog>
  );
};

export default InitialSetupModalWindow;
