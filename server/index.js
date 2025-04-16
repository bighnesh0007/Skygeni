const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const processData = () => {
  try {
    const rawData = fs.readFileSync(path.join(__dirname, 'data.json'));
    const data = JSON.parse(rawData);

    const funnelOrder = ["Suspect", "Qualify", "Demo", "Proposal", "Negotiate", "Won"];
    data.sort((a, b) => funnelOrder.indexOf(a.label) - funnelOrder.indexOf(b.label));

    const totalCount = data[0].count;
    const totalACV = data[0].acv;

    const processedData = data.map((item, index) => {
      const conversionRate = item.diffRate * 100;
      const totalConversionRate = (item.count / totalCount) * 100;
      const totalConversionACV = (item.acv / totalACV) * 100;
      const dropOffCount = index > 0 ? data[index - 1].count - item.count : 0;
      const dropOffACV = index > 0 ? data[index - 1].acv - item.acv : 0;
      const dropOffPercentage = index > 0 ? 100 - conversionRate : 0;

      return {
        ...item,
        conversionRate: parseFloat(conversionRate.toFixed(1)),
        totalConversionRate: parseFloat(totalConversionRate.toFixed(1)),
        totalConversionACV: parseFloat(totalConversionACV.toFixed(1)),
        dropOffCount,
        dropOffACV,
        dropOffPercentage: parseFloat(dropOffPercentage.toFixed(1)),
        formattedACV: formatCurrency(item.acv)
      };
    });

    return {
      funnelData: processedData,
      summary: {
        totalLeads: totalCount,
        totalACV: formatCurrency(totalACV),
        conversionRate: parseFloat(((data[data.length - 1].count / totalCount) * 100).toFixed(1)),
        winRate: parseFloat(((data[data.length - 1].acv / totalACV) * 100).toFixed(1))
      }
    };
  } catch (error) {
    return { error: 'Failed to process data' };
  }
};

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

app.get('/api/funnel-data', (req, res) => {
  const data = processData();
  if (data.error) {
    return res.status(500).json(data);
  }
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

if (!fs.existsSync(path.join(__dirname, 'data.json'))) {
  fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(sampleData, null, 2));
  console.log('Created sample data.json file');
}

module.exports = app;
