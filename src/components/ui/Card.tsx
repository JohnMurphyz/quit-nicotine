import { View, type ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <View
      className={`bg-warm-100 rounded-2xl p-4 border border-warm-200 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
