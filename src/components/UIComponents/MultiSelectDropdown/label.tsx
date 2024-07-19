import React from 'react'
import FormControlLabel from '@mui/material/FormControlLabel';
import { Typography } from '@mui/material'
import { alpha, styled } from '@mui/material/styles';
import { Checkbox } from '@mui/material'

interface PropsCheckboxLabel {
    label?: string
    marginLabel?: string
    onChange?: any
    name?: any
    checked?: boolean
    disabled?: boolean,
    labelBold?: boolean
    id?:any
    Data?:any
}

const StyledCheckbox = styled(Checkbox)
    (({ theme }: { theme: any }) => {
        return {
            color: '#999999',
            padding: '0',
            '&.Mui-checked': {
                color: "#009de2"
            },
            '&.Mui-disabled': {
                color: '#dcdcdc'
            }
        }
    })

export default function CheckboxLabel({
    label,
    marginLabel,
    onChange,
    name,
    checked,
    disabled,
    labelBold,
    id,
    Data
}: PropsCheckboxLabel) {
    return (
        <FormControlLabel
            sx={{
                width: '100%',
                m: '0',
            }}
            disabled={disabled}
            control={
                <StyledCheckbox
                    onChange={onChange}
                    name={name}
                    checked={checked}
                    id={id ? id.toString() : ''}
                    value={Data ? Data.toString(): ''}
                />}
            label={
                <Typography
                    variant='body1'
                    color={!disabled ? 'grey.500' : '#dcdcdc'}
                    ml={marginLabel || '10px'}
                    fontWeight={labelBold ? 500: 400}
                >
                    {label}
                </Typography>}
        />
    )
}
