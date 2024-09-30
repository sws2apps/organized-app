import useApplicationPerson from './useApplicationPerson';
import ApplicationForm from '@features/ministry/application_form';

const PersonApplication = () => {
  const {
    formData,
    handleFormChange,
    handleCoordinatorApproved,
    handleCoordinatorRejected,
    handleSecretaryApproved,
    handleSecretaryRejected,
    handleServiceApproved,
    handleServiceRejected,
  } = useApplicationPerson();

  return (
    <ApplicationForm
      application={formData}
      onChange={handleFormChange}
      onCoordinatorApproved={handleCoordinatorApproved}
      onCoordinatorRejected={handleCoordinatorRejected}
      onSecretaryApproved={handleSecretaryApproved}
      onSecretaryRejected={handleSecretaryRejected}
      onServiceApproved={handleServiceApproved}
      onServiceRejected={handleServiceRejected}
    />
  );
};

export default PersonApplication;
