import { useInitializeWithdrawal } from '@api/hooks/useWallet';
import { Exchange, GHS, NGN, RadioChecked, RadioUnChecked } from '@assets/SVG';
import Input from '@components/Input';
import TransactionPinModal from '@components/TransactionPinModal';
import BackButtonTitleCenter from '@components/Wrappers/BackButtonTitleCenter';
import { useCurrency } from '@hooks/useCurrency';
// import { FormSelect } from '@scenes/CalculatorPage';
import { Box, HStack, Text, View, VStack, Select, CheckIcon, Divider, Input as NInput } from 'native-base';
import React, { FC, memo } from 'react';

export const FormCurrencyPicker = (props: any) => {
  const { currency, setCurrency, label } = props;
  return (
    <Box my="2">
      {label && (
        <Text mb="2" color="CARDVESTGREY.400" fontWeight={'light'}>
          {label}
        </Text>
      )}
      <Box backgroundColor="#F7F9FB">
        <Select
          selectedValue={currency}
          minWidth="200"
          accessibilityLabel={`${label}`}
          placeholder={`${label}`}
          borderColor="#F7F9FB"
          _selectedItem={{
            bg: '#F7F2DD',
            endIcon: <CheckIcon size="5" />,
          }}
          height="50px"
          fontSize="md"
          onValueChange={itemValue => setCurrency(itemValue)}>
          <Select.Item
            isDisabled
            label={`${label}`}
            value="non"
            _disabled={{ opacity: 1 }}
            startIcon={
              <HStack position="relative" w="100%" justifyContent="space-between" alignItems="center">
                <Text fontSize="md" color="CARDVESTGREEN">
                  {label}
                </Text>
              </HStack>
            }
          />
          <Select.Item
            label="NGN"
            value="NGN"
            startIcon={
              <HStack w="100%" justifyContent="space-between" alignItems="center">
                <HStack w="12" mx="-3" h="7" alignItems="center">
                  <NGN />
                  <Text> NGN</Text>
                </HStack>
                {currency === 'NGN' ? (
                  <View w="6" h="5">
                    <RadioChecked />
                  </View>
                ) : (
                  <View w="6" h="5">
                    <RadioUnChecked />
                  </View>
                )}
              </HStack>
            }
          />
          <Select.Item
            label="GHS"
            value="GHS"
            startIcon={
              <HStack w="100%" justifyContent="space-between" alignItems="center">
                <HStack w="12" mx="-3" h="7" alignItems="center">
                  <GHS />
                  <Text> GHS</Text>
                </HStack>
                {currency === 'GHS' ? (
                  <View w="6" h="5">
                    <RadioChecked />
                  </View>
                ) : (
                  <View w="6" h="5">
                    <RadioUnChecked />
                  </View>
                )}
              </HStack>
            }
          />
        </Select>
      </Box>
    </Box>
  );
};

export const CurrencyPicker = ({ currency, setCurrency }: { currency: string; setCurrency: any }) => (
  <Select
    selectedValue={currency}
    w="85px"
    accessibilityLabel="Choose Currency"
    placeholder=""
    backgroundColor="#F7F2DD"
    fontSize="13"
    borderColor="#F7F9FB"
    _selectedItem={{
      bg: '#F7F2DD',
    }}
    mt={1}
    onValueChange={itemValue => setCurrency(itemValue)}>
    <Select.Item
      isDisabled
      label="Select Wallet"
      value="non"
      _disabled={{ opacity: 1 }}
      startIcon={
        <HStack position="relative" w="100%" justifyContent="space-between" alignItems="center">
          <Text fontSize="md" color="CARDVESTGREEN">
            Select Wallet
          </Text>
        </HStack>
      }
    />
    <Select.Item
      label="NGN"
      value="NGN"
      startIcon={
        <HStack w="100%" justifyContent="space-between" alignItems="center">
          <HStack w="12" mx="-3" h="7" alignItems="center">
            <NGN />
            <Text> NGN</Text>
          </HStack>
          {currency === 'NGN' ? (
            <View w="6" h="5">
              <RadioChecked />
            </View>
          ) : (
            <View w="6" h="5">
              <RadioUnChecked />
            </View>
          )}
        </HStack>
      }
    />
    <Select.Item
      label="GHS"
      value="GHS"
      startIcon={
        <HStack w="100%" justifyContent="space-between" alignItems="center">
          <HStack w="12" mx="-3" h="7" alignItems="center">
            <GHS />
            <Text> GHS</Text>
          </HStack>
          {currency === 'GHS' ? (
            <View w="6" h="5">
              <RadioChecked />
            </View>
          ) : (
            <View w="6" h="5">
              <RadioUnChecked />
            </View>
          )}
        </HStack>
      }
    />
  </Select>
);

const WithdrawalUSDT: FC = () => {
  const rate = 10;
  const [modalVisible, setModalVisible] = React.useState(false);
  const [amount, setAmount] = React.useState<number>();
  const [account, setAccount] = React.useState('');
  const [amountUSD, setAmountUSD] = React.useState<number>();
  // const [network, setNetwork] = React.useState('');
  const { mutate: withdrawFunds, isLoading } = useInitializeWithdrawal();
  const { currency, handleSwitchCurrency } = useCurrency();
  const handleSubmit = async () => {
    try {
      await withdrawFunds({
        amount,
        currency,
        type: 'crypto',
        wallet_address: account,
        // network,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleDisabled = () => !account || !amount;

  return (
    <BackButtonTitleCenter
      isLoading={isLoading}
      isDisabled={handleDisabled()}
      title="Withdraw USDT"
      actionText="Proceed"
      action={() => setModalVisible(true)}>
      <TransactionPinModal {...{ handleSubmit, modalVisible, closeModalVisible: () => setModalVisible(false) }} />
      <View my="7">
        <Box position="relative" backgroundColor="#F7F9FB" borderRadius="md" justifyContent="flex-start" mb="10" mt="4">
          <VStack py="8" px="3" w="100%">
            <View>
              <Text color="CARDVESTGREY.50" fontSize="sm">
                Amount
              </Text>
            </View>
            <HStack pb="3" justifyContent={'space-between'}>
              <NInput
                w="70%"
                h="60"
                color="black"
                fontSize="3xl"
                value={amount?.toString()}
                onChangeText={val => {
                  setAmount(Number(val));
                  setAmountUSD(Number(val) * rate);
                }}
                keyboardType="numeric"
                variant="unstyled"
              />
              <CurrencyPicker {...{ currency, setCurrency: handleSwitchCurrency }} />
            </HStack>
            <View position="relative">
              <Divider my="40px" backgroundColor="#909090" />
              <View h="60px" w="60px" zIndex={9} position="absolute" top="10%" left="43%" right="0%">
                <Exchange />
              </View>
            </View>
            <View>
              <Text color="CARDVESTGREY.50" fontSize="sm">
                USDT Equivalent
              </Text>
            </View>
            <HStack alignItems={'center'}>
              <Text color="black" fontSize="3xl">
                $
              </Text>
              <NInput
                w="100%"
                h="60"
                color="black"
                fontSize="3xl"
                onChangeText={val => {
                  setAmountUSD(Number(val));
                  setAmount(Number(val) / rate);
                }}
                value={amountUSD?.toString()}
                variant="unstyled"
              />
            </HStack>
          </VStack>
        </Box>
        <Input label="USDT Wallet Address" value={account} onChangeText={setAccount} />
        <View p="3" />
        {/* <FormSelect label="Network" /> */}
      </View>
    </BackButtonTitleCenter>
  );
};

export default memo(WithdrawalUSDT);
