import { useCallback, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { appLangState, monthNamesState, shortDateFormatState } from '../../appStates/appSettings';

const CustomLocal = () => {
    const { t } = useTranslation();

    const setMonthNames = useSetRecoilState(monthNamesState);
    const setShortDateFormat = useSetRecoilState(shortDateFormatState);

    const appLang = useRecoilValue(appLangState);

    const reloadLocales = useCallback(() => {

        // months array
        let months = [];
        months.push(t("global.january"));
        months.push(t("global.february"));
        months.push(t("global.march"));
        months.push(t("global.april"));
        months.push(t("global.may"));
        months.push(t("global.june"));
        months.push(t("global.july"));
        months.push(t("global.august"));
        months.push(t("global.september"));
        months.push(t("global.october"));
        months.push(t("global.november"));
        months.push(t("global.december"));
        setMonthNames(months);

        // short date format
        setShortDateFormat(t("global.shortDateFormat"));
    }, [t, setMonthNames, setShortDateFormat])

    useEffect(() => {
        reloadLocales();
    }, [appLang, reloadLocales])

    return ( 
        <></>
     );
}
 
export default CustomLocal;