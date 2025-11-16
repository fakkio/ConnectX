import {FormValues} from "@/app/Intro";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Controller, UseFormReturn} from "react-hook-form";

const AVAILABLE_COLORS = [
  {name: "Red", value: "#ff010b"},
  {name: "Yellow", value: "#ffd918"},
  {name: "Blue", value: "#3b82f6"},
  {name: "Green", value: "#22c55e"},
  {name: "Purple", value: "#a855f7"},
  {name: "Orange", value: "#f97316"},
];

const AVAILABLE_PLAYER_TYPES = [
  {value: "human", label: "Human"},
  {value: "random", label: "Random"},
  {value: "monte-carlo", label: "Monte Carlo"},
  {value: "monte-carlo-uct", label: "Monte Carlo UCT"},
] as const;

interface PlayerConfigurationProps {
  control: UseFormReturn<FormValues>["control"];
  label: string;
  name: `players.${number}`;
}
export function PlayerConfiguration({
  control,
  label,
  name,
}: PlayerConfigurationProps) {
  return (
    <FieldSet className="flex-1">
      <FieldLegend className="text-center">{label}</FieldLegend>
      <FieldGroup>
        <Controller
          name={`${name}.type`}
          control={control}
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Player type</FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Player type" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_PLAYER_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name={`${name}.name`}
          control={control}
          rules={{required: label + "'s name is required"}}
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Player name</FieldLabel>
              <Input
                aria-invalid={fieldState.invalid}
                id={field.name}
                placeholder={label + "'s name"}
                type="text"
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name={`${name}.color`}
          control={control}
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`${name}.color`}>Player color</FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Player color" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <span
                        style={{backgroundColor: color.value}}
                        className="inline-block h-3 w-3 rounded-full"
                      />
                      {color.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </FieldSet>
  );
}
