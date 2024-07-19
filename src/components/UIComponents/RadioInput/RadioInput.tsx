import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function RadioButtonsGroup({ label, setValue, value, checked,setLocationOption }: any) {
  const handleCheck = (option: string) => {
    setLocationOption(option)
    // setValue({ ...value, selectedOption: option });
  };
  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
      >
        <FormControlLabel
          value={label.value}
          control={<Radio />}
          label={label.label}
          checked={checked}
          onClick={() => {
            handleCheck(label.value);
          }}
        />
      </RadioGroup>
    </FormControl>
  );
}
