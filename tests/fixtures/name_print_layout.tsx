import { resolve } from 'node:path';
import { Document, Font, Page, Text, View } from '@react-pdf/renderer';
import DefaultPerson from '@views/meetings/midweek/S140/default/S140Person';
import NormalPerson from '@views/meetings/midweek/S140/app_normal/S140Person';
Font.register({
  family: 'Inter',
  fonts: [
    { src: resolve('public/assets/fonts/Inter-Regular.ttf') },
    { src: resolve('public/assets/fonts/Inter-Medium.ttf'), fontWeight: 500 },
    { src: resolve('public/assets/fonts/Inter-Bold.ttf'), fontWeight: 700 },
  ],
});

// Uses the actual PDF components and column widths. Set NAME_PRINT_PREVIEW to
// export the same fixture for visual inspection without committing generated files.
export const nameLayoutDocument = () => {
  return (
    <Document>
      <Page size="A4" style={{ padding: 30, fontFamily: 'Inter' }}>
        {[DefaultPerson, NormalPerson].map((Person, index) => (
          <View key={index} style={{ marginBottom: 30 }}>
            <Text style={{ fontSize: 12, marginBottom: 12 }}>
              {index === 0 ? 'Default S140' : 'Normal S140'}
            </Text>
            <Person
              primary="Alexandria María Elizabeth van der Westhuizen"
              secondary="Christopher Jean Baptiste García Fernández"
              lang="eng"
            />
            <Person primary="William Gonzalez" lang="eng" />
          </View>
        ))}
      </Page>
    </Document>
  );
};
