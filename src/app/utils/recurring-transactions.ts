export class RecurringTransactions {

  getTransactionBreakups(transaction: any) {
    const recurringDates = this.recurringDates(
      transaction.startDate,
      transaction.endDate,
      this.getInterval(transaction.repeat, transaction.interval),
      this.getIntervalType(transaction.repeat),
      false
    );
    const returnData = recurringDates.map(date => {
      const tempDate = new Date(date);
      return {
        label: transaction.label,
        amount: transaction.amount,
        transactionId: transaction.id,
        type: transaction.type,
        dueOn: `${tempDate.getMonth() + 1}-${tempDate.getDate()}-${tempDate.getFullYear()}`,
        isSettled: false
      };
    });
    // console.log(JSON.stringify(returnData, null, 2));
    return returnData;
  }

  recurringDates(startDateString: string, endDateString: string, interval: number, _intervalType: string, noweekends: boolean) {
    const intervalType = _intervalType || 'Date';
    const date: any = new Date(startDateString);
    date.setHours(0, 0, 0, 0);
    const endDate = new Date(endDateString);
    endDate.setHours(23, 59, 59, 999);
    const recurrent = [];
    const setGet = {set: 'set' + intervalType, get: 'get' + intervalType};

    // add 1 day for sunday, subtract one for saturday
    const noWeekend = () => {
      const currentDate = new Date(date), day = date.getDay();
      // tslint:disable-next-line:no-bitwise
      if (~[6, 0].indexOf(day)) {
        currentDate.setDate(currentDate.getDate() + (day === 6 ? -1 : 1));
      }
      return new Date(currentDate);
    };

    while (date < endDate) {
      recurrent.push(noweekends ? noWeekend() : new Date(date));
      date[setGet.set](date[setGet.get]() + interval);
    }
    return recurrent;
  }

  getIntervalType(repeat: string) {
    let returnsValue = 'Month';
    switch (repeat) {
      case 'monthly':
        returnsValue = 'Month';
        break;
      case 'never':
        returnsValue = 'Date';
        break;
      case 'daily':
        returnsValue = 'Date';
        break;
      case 'weekly':
        returnsValue = 'Date';
        break;
      case 'yearly':
        returnsValue = 'FullYear';
        break;
    }
    return returnsValue;
  }

  getInterval(repeat: string, interval: number) {
    let returnsValue = 1;
    switch (repeat) {
      case 'monthly':
        returnsValue = 1 * interval;
        break;
      case 'never':
        returnsValue = 1 * interval;
        break;
      case 'daily':
        returnsValue = 1 * interval;
        break;
      case 'weekly':
        returnsValue = 7 * interval;
        break;
      case 'yearly':
        returnsValue = 1 * interval;
        break;
    }
    return returnsValue;
  }
}
