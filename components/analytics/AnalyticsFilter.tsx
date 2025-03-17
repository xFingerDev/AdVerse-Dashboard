import {
  AnalyticType,
  AnalyticTypeEnum,
  isAnalyticTypeDate,
} from "@/repository/INetworkAnalytic";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import { DateData, MarkedDates } from "react-native-calendars/src/types";
import { Button, Chip, Colors, Text, View } from "react-native-ui-lib";
import BottonSheet from "../settings/BottonSheet";

type AnalyticsFilterProps = {
  rangeDay: AnalyticType;
  setRangeDays: (value: AnalyticType) => void;
};

const AnalyticsFilter: React.FC<AnalyticsFilterProps> = ({
  rangeDay,
  setRangeDays,
}) => {
  const { t } = useTranslation();

  const [visibleCalendar, setVisibleCalendar] = useState(false);
  const CalendarSheet: React.FC = () => {
    const [disableNextMonth, setDisableNextMonth] = useState(true);

    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const selectedDate = useRef<DateData>({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      timestamp: new Date().getTime(),
      dateString: new Date().toISOString().split("T")[0],
    });

    const handleDayPress = (day: number) => {
      setSelectedDates((prev) => {
        const newDates = [day, ...prev.map((date) => date.getTime())];
        if (newDates.length > 2) {
          newDates.pop();
        }

        return Array.from(new Set(newDates)).map(
          (timestamp) => new Date(timestamp)
        );
      });
    };

    const generateMarkedDates = (): MarkedDates => {
      const sortDate = [...selectedDates].sort(
        (a, b) => a.getTime() - b.getTime()
      );

      if (selectedDates.length < 2) {
        return {
          ...sortDate
            .sort((a, b) => a.getTime() - b.getTime())
            .reduce((acc, date, index, array) => {
              return {
                [date.toISOString().split("T")[0]]: {
                  color: "#ec85c7",
                  startingDay: true,
                  endingDay: true,
                  textColor: "white",
                },
              };
            }, {}),
        };
      }

      const [startDate, endDate] = sortDate;
      const dates: { [key: string]: any } = {};

      const startDateFormated = startDate.toISOString().split("T")[0];
      const endDateFormated = endDate.toISOString().split("T")[0];

      const startDateWithFirstHour = new Date(
        Date.UTC(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate()
        )
      );
      const endDateWithLastHour = new Date(
        Date.UTC(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate(),
          23,
          59,
          59
        )
      );

      for (
        let d = startDateWithFirstHour;
        d <= endDateWithLastHour;
        d.setDate(d.getDate() + 1)
      ) {
        const formattedDate = d.toISOString().split("T")[0];
        dates[formattedDate] = {
          startingDay: formattedDate === startDateFormated,
          endingDay: formattedDate === endDateFormated,
          color: "#ec85c7",
          textColor: "white",
        };
      }

      return dates;
    };

    const handleExitButton = () => {
      if (!selectedDates.length) {
        return;
      }
      const [startDate, endDate] = selectedDates.sort(
        (a, b) => a.getTime() - b.getTime()
      );
      setRangeDays({ start: startDate, end: endDate ?? startDate });
      setVisibleCalendar(false);
    };

    return (
      <BottonSheet
        isVisible={visibleCalendar}
        onClose={function () {
          setVisibleCalendar(false);
        }}
      >
        <View margin-16>
          <Button
            style={{
              ...(!selectedDates.length ? {} : { backgroundColor: "#ec85c7" }),
            }}
            onPress={handleExitButton}
            disabled={!selectedDates.length}
          >
            <Text color={"white"}>Save</Text>
          </Button>
          <Calendar
            maxDate={new Date(Date.now() - 86400000).toString()}
            onDayPress={(data) => {
              handleDayPress(data.timestamp);
            }}
            showSixWeeks={true}
            renderArrow={(direction) => (
              <Ionicons
                color={
                  disableNextMonth && direction === "right"
                    ? "#d9e1e8"
                    : "#ec85c7"
                }
                size={24}
                name={
                  direction === "left"
                    ? "chevron-back-outline"
                    : "chevron-forward-outline"
                }
              />
            )}
            enableSwipeMonths={true}
            onMonthChange={(data) => {
              const currentDate = new Date();
              const currentMonth = currentDate.getMonth() + 1;
              const currentYear = currentDate.getFullYear();

              setDisableNextMonth(
                data.month === currentMonth && data.year === currentYear
              );
              selectedDate.current = data;
            }}
            disableArrowRight={disableNextMonth}
            theme={{
              arrowColor: "#ec85c7",
              disabledArrowColor: "#d9e1e8",
              textDayFontFamily: "Nunito",
              textMonthFontFamily: "Nunito",
              textDayHeaderFontFamily: "Nunito",
            }}
            markingType={"period"}
            markedDates={generateMarkedDates()}
          />
        </View>
      </BottonSheet>
    );
  };

  return (
    <>
      <CalendarSheet />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View row>
          {Object.keys(AnalyticTypeEnum).map((key, index) => (
            <Chip
              key={index}
              label={t(`analytics.filter.date.${key}`)}
              marginH-8
              backgroundColor={rangeDay === key ? "#ec85c7" : "transparent"}
              labelStyle={{
                color: rangeDay === key ? Colors.white : "#666",
                fontFamily: "Nunito",
                fontSize: 14,
                fontWeight: rangeDay === key ? "600" : "400",
              }}
              containerStyle={{
                marginLeft: index === 0 ? 20 : 0,
                borderColor: rangeDay === key ? "#ec85c7" : "#ddd",
                borderWidth: 1,
                borderRadius: 20,
                paddingVertical: 6,
                elevation: rangeDay === key ? 2 : 0,
              }}
              onPress={() => setRangeDays(key as AnalyticType)}
            />
          ))}
          <Chip
            label={
              isAnalyticTypeDate(rangeDay)
                ? `${rangeDay.start.toLocaleDateString()} - ${rangeDay.end.toLocaleDateString()}`
                : t(`analytics.filter.date.custom`)
            }
            backgroundColor={
              isAnalyticTypeDate(rangeDay) ? "#ec85c7" : "transparent"
            }
            labelStyle={{
              color: isAnalyticTypeDate(rangeDay) ? Colors.white : "#666",
              fontFamily: "Nunito",
              fontSize: 14,
              fontWeight: isAnalyticTypeDate(rangeDay) ? "600" : "400",
            }}
            containerStyle={{
              marginRight: 20,
              borderColor: isAnalyticTypeDate(rangeDay) ? "#ec85c7" : "#ddd",
              borderWidth: 1,
              borderRadius: 20,
              paddingVertical: 6,
              elevation: isAnalyticTypeDate(rangeDay) ? 2 : 0,
            }}
            onPress={() => !visibleCalendar && setVisibleCalendar(true)}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default AnalyticsFilter;
