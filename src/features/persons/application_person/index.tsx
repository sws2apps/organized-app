import useApplicationPerson from './useApplicationPerson';
import ApplicationForm from '@features/ministry/application_form';

const PersonApplication = () => {
  const { formData, handleFormChange } = useApplicationPerson();

  return <ApplicationForm application={formData} onChange={handleFormChange} />;
};

export default PersonApplication;
