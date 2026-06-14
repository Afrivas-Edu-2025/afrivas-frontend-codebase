import { store } from '../store/store'
import { mainApi } from '../store/api/mainApi'

/**
 * Prefetches data from all core endpoints using RTK Query and stores it in the Redux state.
 * This loads 100 objects from large datasets (Students, Lecturers) and full lists for others.
 */
export const prefetchAllData = async () => {
  console.log('Starting RTK Query prefetch for 100 objects per endpoint...')

  const dispatch = store.dispatch

  // Define endpoints to prefetch
  const prefetchActions = [
    dispatch(mainApi.endpoints.getStudents.initiate({ page: 100 })),
    dispatch(mainApi.endpoints.getLecturers.initiate({ page: 100 })),
    dispatch(mainApi.endpoints.getFaculties.initiate()),
    dispatch(mainApi.endpoints.getDepartments.initiate()),
    dispatch(mainApi.endpoints.getLevels.initiate()),
    dispatch(mainApi.endpoints.getModules.initiate()),
    dispatch(mainApi.endpoints.getSemesters.initiate()),
  ]

  try {
    // Wait for all prefetch requests to complete
    await Promise.all(prefetchActions)
    console.log('RTK Query Prefetch complete. Data stored in Redux state.')
  } catch (error) {
    console.warn('One or more prefetch requests failed:', error)
  }
}

export default prefetchAllData
