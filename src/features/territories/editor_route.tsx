import RouteProtected from '@components/route_protected';
import useTerritoryAccess from '@features/territories/useTerritoryAccess';

// the same rule the dashboard links use, including the server's manager flag
const TerritoryEditorRoute = () => {
  const { editor } = useTerritoryAccess();

  return <RouteProtected allowed={editor} />;
};

export default TerritoryEditorRoute;
