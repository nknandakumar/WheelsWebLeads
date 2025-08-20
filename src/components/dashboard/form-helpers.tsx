"use client";

import { Control } from "react-hook-form";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";


interface SelectOption {
	label: string;
	value: string;
}

interface FormSelectProps {
	control: Control<any>;
	name: string;
	label: string;
	placeholder: string;
	options: SelectOption[];
	disabled?: boolean;
}


export const FormSelect = ({
	control,
	name,
	label,
	placeholder,
	options,
	disabled = false,
}: FormSelectProps) => (
	<FormField
		control={control}
		name={name}
		render={({ field }) => (
			<FormItem>
				<FormLabel className="text-black font-medium">{label}</FormLabel>
				<Select
					onValueChange={field.onChange}
					defaultValue={field.value}
					disabled={disabled}
				>
					<FormControl>
						<SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500 focus:ring-1 bg-white">
							<SelectValue
								placeholder={placeholder}
								className="text-gray-700"
							/>
						</SelectTrigger>
					</FormControl>
					<SelectContent className="bg-white border-gray-300">
						{options.map((option) => (
							<SelectItem
								key={option.value}
								value={option.value}
								className="text-gray-700 hover:bg-gray-100"
							>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<FormMessage />
			</FormItem>
		)}
	/>
);

interface FormInputProps {
	control: Control<any>;
	name: string;
	label: string;
	placeholder: string;
	type?: string;
	disabled?: boolean;
	className?: string;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
	uppercase?: boolean;
}

export const FormInput = ({
	control,
	name,
	label,
	placeholder,
	type = "text",
	disabled = false,
	className,
	onChange,
	onBlur,
	uppercase = false,
}: FormInputProps) => (
	<FormField
		control={control}
		name={name}
		render={({ field }) => (
			<FormItem className={className}>
				<FormLabel className="text-black font-medium">{label}</FormLabel>
				<FormControl>
					<Input
						placeholder={placeholder}
						type={type}
						{...field}
						className={`border-gray-300 focus:border-green-500 focus:ring-green-500 focus:ring-1 text-gray-900 placeholder:text-gray-500 bg-white ${uppercase ? 'uppercase' : ''} ${type === 'number' ? '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' : ''}`}
						onChange={(e) => {
							if (uppercase) {
								e.target.value = e.target.value.toUpperCase();
							}
							field.onChange(e);
							if (onChange) onChange(e);
						}}
						onBlur={(e) => {
							field.onBlur();
							if (onBlur) onBlur(e);
						}}
						disabled={disabled}
					/>
				</FormControl>
				<FormMessage />
			</FormItem>
		)}
	/>
);

// Custom input for PAN validation (10 characters, alphanumeric)
export const FormPanInput = ({
	control,
	name,
	label,
	placeholder,
	disabled = false,
	className,
}: Omit<FormInputProps, "type" | "onChange" | "onBlur">) => (
	<FormField
		control={control}
		name={name}
		render={({ field }) => (
			<FormItem className={className}>
				<FormLabel className="text-black font-medium">{label}</FormLabel>
				<FormControl>
					<Input
						placeholder={placeholder}
						type="text"
						{...field}
						maxLength={10}
						className="border-gray-300 focus:border-green-500 focus:ring-green-500 focus:ring-1 text-gray-900 placeholder:text-gray-500 bg-white uppercase"
						onChange={(e) => {
							const value = e.target.value
								.toUpperCase()
								.replace(/[^A-Z0-9]/g, "");
							if (value.length <= 10) {
								field.onChange(value);
							}
						}}
						disabled={disabled}
					/>
				</FormControl>
				<FormMessage />
			</FormItem>
		)}
	/>
);

// Custom input for mobile validation (10 digits only)
export const FormMobileInput = ({
	control,
	name,
	label,
	placeholder,
	disabled = false,
	className,
}: Omit<FormInputProps, "type" | "onChange" | "onBlur">) => (
	<FormField
		control={control}
		name={name}
		render={({ field }) => (
			<FormItem className={className}>
				<FormLabel className="text-black font-medium">{label}</FormLabel>
				<FormControl>
					<Input
						placeholder={placeholder}
						type="tel"
						{...field}
						maxLength={10}
						className="border-gray-300 focus:border-green-500 focus:ring-green-500 focus:ring-1 text-gray-900 placeholder:text-gray-500 bg-white"
						onChange={(e) => {
							const value = e.target.value.replace(/\D/g, "");
							if (value.length <= 10) {
								field.onChange(value);
							}
						}}
						disabled={disabled}
					/>
				</FormControl>
				<FormMessage />
			</FormItem>
		)}
	/>
);

// Custom input for date formatting (DD/MM/YYYY)
export const FormDateInput = ({
	control,
	name,
	label,
	placeholder,
	disabled = false,
	className,
}: Omit<FormInputProps, "type" | "onChange" | "onBlur">) => (
	<FormField
		control={control}
		name={name}
		render={({ field }) => (
			<FormItem className={className}>
				<FormLabel className="text-black font-medium">{label}</FormLabel>
				<FormControl>
					<Input
						placeholder={placeholder}
						type="text"
						{...field}
						maxLength={10}
						className="border-gray-300 focus:border-green-500 focus:ring-green-500 focus:ring-1 text-gray-900 placeholder:text-gray-500 bg-white"
						onChange={(e) => {
							let value = e.target.value.replace(/\D/g, "");
							if (value.length >= 2 && value.length < 4) {
								value = value.slice(0, 2) + "/" + value.slice(2);
							} else if (value.length >= 4 && value.length < 6) {
								value =
									value.slice(0, 2) +
									"/" +
									value.slice(2, 4) +
									"/" +
									value.slice(4);
							} else if (value.length >= 6) {
								value =
									value.slice(0, 2) +
									"/" +
									value.slice(2, 4) +
									"/" +
									value.slice(4, 8);
							}
							field.onChange(value);
						}}
						disabled={disabled}
					/>
				</FormControl>
				<FormMessage />
			</FormItem>
		)}
	/>
);
