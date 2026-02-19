import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { useState } from 'react';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="mb-6">
      {label && (
        <Text className="text-sm text-warm-400 mb-1">{label}</Text>
      )}
      <TextInput
        className="bg-transparent text-base text-warm-900 py-2 px-0"
        placeholderTextColor="#b09a82"
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
      <View
        className={`h-[1px] ${
          error
            ? 'bg-red-500'
            : focused
              ? 'bg-warm-500 h-[2px]'
              : 'bg-warm-200'
        }`}
      />
      {error && <Text className="text-sm text-red-500 mt-1">{error}</Text>}
      {hint && !error && <Text className="text-xs text-warm-400 mt-1">{hint}</Text>}
    </View>
  );
}
