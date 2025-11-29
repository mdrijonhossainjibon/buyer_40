import { eventChannel, EventChannel } from 'redux-saga';
import { call, put, take, fork } from 'redux-saga/effects';
import { getSocketClient } from 'lib/socket/socketClient';
import { convertSuccess, convertFailure, setConverting, setProcessingStep } from './actions';
 

/**
 * Create event channel for converter socket events
 */
function createConverterSocketChannel(): EventChannel<any> {
  return eventChannel((emit) => {
    const socketClient = getSocketClient();

    // Listen for converter:processing event
    socketClient.on('converter:processing', (data: any) => {
      emit({ type: 'PROCESSING', payload: data });
    });

    // Listen for converter:success event
    socketClient.on('converter:success', (data: any) => {
      emit({ type: 'SUCCESS', payload: data });
    });

    // Listen for converter:failure event
    socketClient.on('converter:failure', (data: any) => {
      emit({ type: 'FAILURE', payload: data });
    });

    // Return unsubscribe function
    return () => {
      socketClient.off('converter:processing');
      socketClient.off('converter:success');
      socketClient.off('converter:failure');
    };
  });
}

/**
 * Watch for converter socket events
 */
function* watchConverterSocketEvents(): Generator<any, void, any> {
  const channel = yield call(createConverterSocketChannel);

  try {
    while (true) {
      const event = yield take(channel);

      switch (event.type) {
        case 'PROCESSING':
          console.log('🔄 Converter processing:', event.payload);
          yield put(setConverting(true));
          // Update processing step and progress
          if (event.payload.step) {
            yield put(setProcessingStep(event.payload.step, event.payload.progress || 0));
          }
          break;

        case 'SUCCESS':
          console.log('✅ Converter success:', event.payload);
          const { data } = event.payload;

          if (data) {
            // Update converter state
            yield put(convertSuccess(data.newBalances));
          }
          break;

        case 'FAILURE':
          console.error('❌ Converter failure:', event.payload);
          yield put(convertFailure(event.payload.error || 'Conversion failed'));
          //toast.error(event.payload.error || 'Conversion failed', { id: 'convert' });
          break;

        default:
          console.warn('Unknown converter socket event:', event.type);
      }
    }
  } catch (error: any) {
    console.error('Error in converter socket saga:', error);
  }
}

/**
 * Root converter socket saga
 */
export function* converterSocketSaga() {
  yield fork(watchConverterSocketEvents);
}
