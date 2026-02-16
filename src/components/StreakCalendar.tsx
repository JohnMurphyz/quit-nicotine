import { View, Text } from 'react-native';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  subMonths,
  addMonths,
  isSameMonth,
} from 'date-fns';
import { useState } from 'react';
import { Pressable } from 'react-native';
import type { StreakConfirmation } from '@/src/types';

interface StreakCalendarProps {
  confirmations: StreakConfirmation[];
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function StreakCalendar({ confirmations }: StreakCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const confirmedDates = new Set(
    confirmations.map((c) => c.confirmed_date)
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart);

  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      {/* Month navigation */}
      <View className="flex-row items-center justify-between mb-4">
        <Pressable onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <Text className="text-primary-600 text-lg px-2">‹</Text>
        </Pressable>
        <Text className="text-lg font-semibold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </Text>
        <Pressable onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <Text className="text-primary-600 text-lg px-2">›</Text>
        </Pressable>
      </View>

      {/* Weekday headers */}
      <View className="flex-row mb-2">
        {WEEKDAYS.map((day) => (
          <View key={day} className="flex-1 items-center">
            <Text className="text-xs text-gray-400 font-medium">{day}</Text>
          </View>
        ))}
      </View>

      {/* Day grid */}
      <View className="flex-row flex-wrap">
        {/* Padding for days before month start */}
        {Array.from({ length: startPadding }).map((_, i) => (
          <View key={`pad-${i}`} className="w-[14.28%] h-10" />
        ))}

        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isConfirmed = confirmedDates.has(dateStr);
          const isToday =
            format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

          return (
            <View
              key={dateStr}
              className="w-[14.28%] h-10 items-center justify-center"
            >
              <View
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  isConfirmed
                    ? 'bg-primary-500'
                    : isToday
                    ? 'border-2 border-primary-300'
                    : ''
                }`}
              >
                <Text
                  className={`text-sm ${
                    isConfirmed
                      ? 'text-white font-bold'
                      : isToday
                      ? 'text-primary-600 font-semibold'
                      : 'text-gray-600'
                  }`}
                >
                  {format(day, 'd')}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
