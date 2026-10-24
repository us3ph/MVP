// Query keys of the React Query cache.
export const qk = {
  referentials: ['referentials'],
  cities: (country) => ['cities', country],
  missions: ['missions'],
  mission: (id) => ['missions', id],
  expenseReports: ['expense-reports'],
  notifications: ['notifications'],
  profile: ['profile'],
  delegations: ['delegations'],
};
