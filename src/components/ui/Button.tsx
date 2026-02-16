import { Pressable, Text, ActivityIndicator, type PressableProps } from 'react-native';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variantStyles = {
  primary: 'bg-primary-600 active:bg-primary-700',
  secondary: 'bg-gray-600 active:bg-gray-700',
  outline: 'border-2 border-primary-600 bg-transparent active:bg-primary-50',
  ghost: 'bg-transparent active:bg-gray-100',
};

const variantTextStyles = {
  primary: 'text-white',
  secondary: 'text-white',
  outline: 'text-primary-600',
  ghost: 'text-primary-600',
};

const sizeStyles = {
  sm: 'px-3 py-2',
  md: 'px-5 py-3',
  lg: 'px-8 py-4',
};

const sizeTextStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={`rounded-xl items-center justify-center flex-row ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled || loading ? 'opacity-50' : ''
      }`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'secondary' ? '#fff' : '#16a34a'}
          className="mr-2"
        />
      )}
      <Text
        className={`font-semibold ${variantTextStyles[variant]} ${sizeTextStyles[size]}`}
      >
        {title}
      </Text>
    </Pressable>
  );
}
