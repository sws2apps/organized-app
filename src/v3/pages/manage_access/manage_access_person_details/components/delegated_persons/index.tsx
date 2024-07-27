import {
  CustomDropdownContainer,
  CustomDropdownItem,
  CustomDropdownMenu,
} from '@components/dropdown';
import CustomTypography from '@components/typography';
import useAppTranslation from '@hooks/useAppTranslation';
import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { DelegatedPersonsProps } from './delegated_persons.type';
import MiniChip from '@components/mini_chip';

const DelegatedPersons = (props: DelegatedPersonsProps) => {
  const { t } = useAppTranslation();

  const [checkedDelegatedPersons, setCheckedDelegatedPersons] = useState(() => {
    return Array<boolean>(props.persons.length).fill(false);
  });

  const getArrayWithCheckedDelegatedPersons = (): string[] => {
    const tmpArray = [];

    props.persons.forEach((value, index) => {
      if (checkedDelegatedPersons[index]) {
        tmpArray.push(props.persons[index]);
      }
    });

    return tmpArray;
  };

  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const delegatePersonseContainerRef = useRef(null);
  const delegatedPersonsDropdownMenu = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownIsOpen &&
        delegatedPersonsDropdownMenu.current &&
        !delegatedPersonsDropdownMenu.current.contains(event.target)
      ) {
        setDropdownIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownIsOpen]);

  return (
    <>
      <Box>
        <CustomTypography
          className="label-small-regular"
          color={'var(--accent-350)'}
        >
          {t('tr_delegatePersons')}
        </CustomTypography>
        <Box
          ref={delegatePersonseContainerRef}
          sx={{
            borderBottom: '1.25px solid var(--accent-300)',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '8px',
            padding: '8px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '4px',
              flexWrap: 'wrap',
            }}
          >
            {getArrayWithCheckedDelegatedPersons().map((value) => {
              const randomKey = crypto.randomUUID();

              return (
                <MiniChip
                  label={value}
                  key={randomKey}
                  edit={true}
                  onDelete={() => {
                    props.persons.forEach((globalValue, index) => {
                      if (value == globalValue) {
                        setCheckedDelegatedPersons((prev) => {
                          const tmpArray = [...prev];
                          tmpArray[index] = false;

                          return tmpArray;
                        });
                      }
                    });
                  }}
                />
              );
            })}
          </Box>
          <CustomDropdownContainer
            label={''}
            open={dropdownIsOpen}
            onClick={() => setDropdownIsOpen((prev) => !prev)}
            arrowColor="var(--accent-350)"
          />
        </Box>
      </Box>
      <CustomDropdownMenu
        reference={delegatedPersonsDropdownMenu}
        open={dropdownIsOpen}
        anchorElement={delegatePersonseContainerRef.current}
        width={delegatePersonseContainerRef.current?.offsetWidth + 'px'}
        zIndex={(theme) => theme.zIndex.drawer + 1}
      >
        {props.persons.map((value, index) => {
          const randomKey = crypto.randomUUID();

          return (
            <CustomDropdownItem
              variant="checkboxes"
              checked={checkedDelegatedPersons[index]}
              label={value}
              key={randomKey}
              callback={() => {
                null;
              }}
              onCheckboxClick={(e, checked) => {
                setCheckedDelegatedPersons((prev) => {
                  const updatedArray = [...prev];
                  updatedArray[index] = checked;
                  return updatedArray;
                });
              }}
            />
          );
        })}
      </CustomDropdownMenu>
    </>
  );
};

export default DelegatedPersons;
