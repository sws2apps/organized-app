import assert from 'node:assert/strict';
import { test } from 'node:test';
import { exportFileName } from '../src/utils/file_export.ts';
import {
  exportFile,
  registerFileExporter,
} from '../src/services/files/export.ts';
import {
  A5_HORIZONTAL,
  S12,
  PHONE_GRID,
  phoneGridLayout,
  A5_VERTICAL,
  PRINT_MARGIN,
  printableA5,
} from '../src/views/territories/geometry.ts';

test('export names are portable without losing their extension', () => {
  assert.equal(
    exportFileName('M22/M23: territory?.pdf'),
    'M22-M23- territory-.pdf'
  );
  assert.equal(exportFileName('CON.pdf'), '_CON.pdf');
  assert.equal(exportFileName('LPT1.pdf'), '_LPT1.pdf');
  assert.equal(exportFileName('Müller.pdf '), 'Müller.pdf');
  assert.equal(exportFileName('..'), 'export');
});

test('both A5 frames reserve 8 mm on every edge without changing the sheet size', () => {
  for (const size of [A5_HORIZONTAL, A5_VERTICAL]) {
    const frame = printableA5(size);
    assert.ok(Math.abs(frame.width + 2 * PRINT_MARGIN - size.width) < 0.001);
    assert.ok(Math.abs(frame.height + 2 * PRINT_MARGIN - size.height) < 0.001);
    assert.ok(Math.abs((PRINT_MARGIN * 25.4) / 72 - 8) < 0.001);
  }
});

test('browser export awaits a completed write and preserves picker cancellation', async () => {
  const calls: string[] = [];
  const blob = new Blob(['PDF'], { type: 'application/pdf' });
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      showSaveFilePicker: async ({
        suggestedName,
      }: {
        suggestedName: string;
      }) => {
        assert.equal(suggestedName, 'M22-M23.pdf');
        calls.push('pick');
        return {
          createWritable: async () => ({
            write: async (value: Blob) => {
              assert.equal(value, blob);
              calls.push('write');
            },
            close: async () => {
              calls.push('close');
            },
            abort: async () => {
              calls.push('abort');
            },
          }),
        };
      },
    },
  });
  assert.equal(await exportFile(blob, 'M22/M23.pdf'), true);
  assert.deepEqual(calls, ['pick', 'write', 'close']);
  window.showSaveFilePicker = async () => {
    throw new DOMException('Cancelled', 'AbortError');
  };
  assert.equal(await exportFile(blob, 'M22.pdf'), false);
  const failure = new Error('Disk full');
  window.showSaveFilePicker = async () => ({
    createWritable: async () => ({
      write: async () => {
        throw failure;
      },
      close: async () => {
        assert.fail('must not complete a failed write');
      },
      abort: async () => {
        calls.push('abort');
      },
    }),
  });
  await assert.rejects(exportFile(blob, 'M22.pdf'), failure);
  assert.equal(calls.at(-1), 'abort');
});

test('generated exports choose a destination before expensive work and skip it on cancellation', async () => {
  const calls: string[] = [];
  window.showSaveFilePicker = async () => {
    calls.push('pick');
    return {
      createWritable: async () => ({
        write: async () => {
          calls.push('write');
        },
        close: async () => {
          calls.push('close');
        },
        abort: async () => {},
      }),
    };
  };
  const generate = async () => {
    calls.push('generate');
    return new Blob(['PDF']);
  };
  const exporting = exportFile(generate, 'map.pdf');
  assert.deepEqual(calls, ['pick']);
  assert.equal(await exporting, true);
  assert.deepEqual(calls, ['pick', 'generate', 'write', 'close']);
  calls.length = 0;
  window.showSaveFilePicker = async () => {
    throw new DOMException('Cancelled', 'AbortError');
  };
  assert.equal(await exportFile(generate, 'map.pdf'), false);
  assert.deepEqual(calls, []);
});

test('generation failure does not truncate an existing destination', async () => {
  const failure = new Error('Map unavailable');
  window.showSaveFilePicker = async () => ({
    createWritable: async () => {
      assert.fail('must not open a stream until the file is ready');
    },
  });
  await assert.rejects(
    exportFile(async () => {
      throw failure;
    }, 'map.pdf'),
    failure
  );
});

test('native export receives a portable filename and propagates the save result', async () => {
  registerFileExporter(async (_, name) => {
    assert.equal(name, 'M22-M23.pdf');
    return false;
  });
  assert.equal(await exportFile(new Blob(['PDF']), 'M22/M23.pdf'), false);
});

test('portable export names handle long trailing punctuation and Unicode', () => {
  assert.equal(exportFileName('Gebiet 😀.' + ' .'.repeat(50000)), 'Gebiet 😀');
  assert.equal(exportFileName('CON.example.pdf'), '_CON.example.pdf');
});

test('phone cards reserve an overflow cell and keep every row inside the frame', () => {
  for (const size of [
    S12,
    printableA5(A5_HORIZONTAL),
    printableA5(A5_VERTICAL),
  ]) {
    const height = size.height - 29 - 38;
    for (const total of [0, 1, 31, 32, 33, 100, 1000]) {
      const { columns, shown, remaining } = phoneGridLayout(
        height,
        total,
        size.width - 18,
        120
      );
      const cells = shown + (remaining > 0 ? 1 : 0);
      const rows = Math.ceil(cells / columns);
      const used =
        rows * PHONE_GRID.cellHeight + Math.max(0, rows - 1) * PHONE_GRID.gap;
      assert.ok(used <= height);
      assert.equal(shown + remaining, total);
    }
  }
  assert.deepEqual(phoneGridLayout(234, 32, 449, 109), {
    columns: 4,
    shown: 32,
    remaining: 0,
  });
  assert.deepEqual(phoneGridLayout(234, 33, 449, 109), {
    columns: 4,
    shown: 31,
    remaining: 2,
  });
});

test('narrow phone cards reduce columns to preserve full dialable numbers', () => {
  assert.equal(phoneGridLayout(500, 100, 357, 120).columns, 2);
  assert.equal(phoneGridLayout(234, 100, 449, 120).columns, 3);
  assert.equal(phoneGridLayout(400, 100, 550, 120).columns, 4);
});
